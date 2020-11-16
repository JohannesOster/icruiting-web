import React, {useState, useCallback, useRef, useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {useTheme} from 'styled-components';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import useSWR from 'swr';
import {object, string} from 'yup';
import {Button, Input, Link, Dialog, useToaster} from 'icruiting-ui';
import {errorsFor} from 'utils/reactHookFormHelper';
import {H3, H6, Box, Typography, getDashboardLayout} from 'components';
import {Clipboard} from 'icons';
import {DnDFormField, DnDSection, DnDSourceItem} from 'lib/formbuilder/DnD';
import {DnDItem, ComponentToEdit} from 'lib/formbuilder/types';
import {EditFormFieldForm} from 'lib/formbuilder/EditFormFieldForm';
import {useFormBuilder} from 'lib/formbuilder/useFormBuilder';
import {getSourceFormFields} from 'lib/formbuilder/sourceFormFields';
import {getInitialFormFields} from 'lib/formbuilder/initialFormFields';
import {
  DragAndDropList,
  IconContainer,
  ButtonGroup,
  Overlay,
  DnDSourceSection,
  DnDTargetSection,
  FormGrid,
  FormCodeTextarea,
} from 'lib/formbuilder/FormBuilder.sc';
import {API, FormCategory} from 'services';
import amplifyConfig from 'amplify.config';
import {converter} from 'lib/formbuilder/converter';
import {useRouter} from 'next/router';
import {withAdmin} from 'requireAuth';

const FormBuilder: React.FC = () => {
  const toaster = useToaster();
  const {colors, spacing} = useTheme();
  const router = useRouter();
  const {
    formId: formIdEdit,
    formCategory = 'application',
    jobId,
  } = router.query as {
    formId?: string;
    formCategory?: FormCategory;
    jobId: string;
  };
  const [status, setStatus] = useState('idle');
  const formId = useRef(formIdEdit || uuidv4());
  const [sourceSectionMargin, setSourceSectionMargin] = useState(0);

  const formKey = formIdEdit ? [`GET /forms/${formId}`, formIdEdit] : null;
  const {data: formToEdit} = useSWR(formKey, (_key, formId) =>
    API.forms.find(formId),
  );

  const {data: job} = useSWR(
    [`GET /jobs/${jobId}`, jobId],
    (_key: string, jobId) => API.jobs.find(jobId),
  );

  const {register, formState, errors, getValues, reset} = useForm({
    mode: 'onChange',
    resolver: yupResolver(
      object({
        formTitle: string().required('Formulartitel ist verpflichtend!'),
      }),
    ),
    defaultValues: {formTitle: formToEdit?.formTitle},
    criteriaMode: 'all',
  });

  useEffect(() => {
    if (!formToEdit) return;
    reset({formTitle: formToEdit?.formTitle});
  }, [formToEdit, reset]);

  useEffect(() => {
    window.onscroll = () => {
      const shouldScroll = window.pageYOffset < 100;
      const offset = window.pageYOffset + 100;
      setSourceSectionMargin(shouldScroll ? 0 : offset);
    };

    return () => {
      window.onscroll = null;
    };
  });

  const [
    componentToEdit,
    setComponentToEdit,
  ] = useState<null | ComponentToEdit>(null);
  const sourceItems = getSourceFormFields(
    formToEdit?.formCategory || formCategory,
  );
  const initialformFields = formToEdit
    ? formToEdit.formFields
        .map(converter.toDnDItem)
        .sort((one, two) => one.rowIndex - two.rowIndex)
    : getInitialFormFields(formCategory);

  const {
    formFields,
    addItem,
    moveItem,
    editItem,
    deleteItem,
    duplicateItem,
    onOutsideHover,
    onDrop,
  } = useFormBuilder({initialformFields});

  const showEditItemForm = useCallback(
    (id: string) => {
      const item = formFields.filter((item) => item.id === id)[0];
      setComponentToEdit({
        id: id,
        component: item.component,
        props: item.props,
      });
    },
    [formFields],
  );

  /** Map the array of form source items to actual jsx */
  const FormSource = sourceItems.map((item: DnDItem, idx: number) => {
    const Icon = item.icon || (() => <></>);
    return (
      <DnDSourceItem key={idx} item={item}>
        <IconContainer>
          <Icon
            style={{color: colors.inputBorder, width: '14px', height: 'auto'}}
          />
        </IconContainer>
        {item.label}
      </DnDSourceItem>
    );
  });

  /** Map the array of formFields to actual jsx */
  const Form = formFields.map((item: DnDItem) => {
    const Component = item.as;
    return (
      <DnDFormField
        key={item.id}
        id={item.id}
        rowIndex={item.rowIndex}
        moveItem={moveItem}
        addItem={addItem}
        duplicateItem={duplicateItem}
        onDelete={item.deletable ? deleteItem : undefined}
        onEdit={item.editable ? showEditItemForm : undefined}
      >
        <Component {...item.props} />
      </DnDFormField>
    );
  });

  const onSave = () => {
    setStatus('submitting');
    const form = {
      formId: formId.current,
      jobId: jobId,
      formCategory: formCategory || formToEdit?.formCategory,
      formTitle: getValues().formTitle,
      formFields: formFields.map(converter.toAPIFormField),
    };

    const request = formToEdit ? API.forms.update : API.forms.create;
    const errorHandler = (error: Error) => {
      toaster.danger(error.message);
      setStatus('idle');
    };

    let promise;
    if (!formToEdit) {
      promise = request(form).then(() => {
        toaster.success('Formular erfolgreich erstellt.');
        router.back();
      });
    } else {
      promise = request(form).then(() => {
        toaster.success('Formular erfolgreich bearbeitet!');
        router.back();
      });
    }

    promise.catch(errorHandler);
  };

  /** private on Drop to automatically show edit form for new items */
  const _onDrop = () => {
    const tmp = onDrop();
    if (tmp) showEditItemForm(tmp.toString());
  };

  const domain = amplifyConfig.API.endpoints[0].endpoint;
  const iframeSrc = `${domain}/forms/${formId.current}/html`;
  const formCode = `<!-- Begin icruiting webform --><iframe src="${iframeSrc}" style="width: 100%; border: none;" scroll="no" id="${formId.current}-iframe" ></iframe><script>window.addEventListener("message", (event) => {if (event.origin !== "${domain}") return;document.getElementById("${formId.current}-iframe").style.height=event.data + "px";});</script><!-- End icruiting webform -->`;
  const copyCode = () => {
    const textarea = document.getElementById(
      'form-code',
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      textarea.blur();
      toaster.success('Erfolgreich ins clipboard kopiert!');
    } else {
      toaster.danger('Fehlgeschlagen. Bitte kopieren Sie es manuell!');
    }
  };

  return (
    <>
      {componentToEdit && job && (
        <Dialog onClose={() => setComponentToEdit(null)}>
          <EditFormFieldForm
            componentToEdit={componentToEdit}
            onSubmit={(values) => {
              editItem && editItem(componentToEdit.id, values);
              setComponentToEdit(null);
            }}
            formCategory={formCategory || formToEdit?.formCategory}
            job={job}
          />
        </Dialog>
      )}
      <Box display="flex" alignItems="center" marginBottom={spacing.scale200}>
        <H3>{formToEdit ? 'Formular bearbeiten' : 'Neues Formular'}</H3>
        <ButtonGroup>
          <Button
            onClick={onSave}
            disabled={!formState.isValid}
            isLoading={status === 'submitting'}
          >
            Speichern
          </Button>
          <Button onClick={() => router.back()}>Abbrechen</Button>
        </ButtonGroup>
      </Box>
      <Box display="flex" position="relative" marginBottom={spacing.scale600}>
        <DnDSection
          onHover={onOutsideHover}
          render={(targetID, drop) => <Overlay id={targetID} ref={drop} />}
        />
        <DnDSection
          onDrop={_onDrop}
          render={(targetID, drop) => (
            <DnDTargetSection id={targetID} ref={drop}>
              <FormGrid>
                {Form}
                <div>
                  <Button>Absenden</Button>
                </div>
              </FormGrid>
            </DnDTargetSection>
          )}
        />
        <DnDSection
          onHover={onOutsideHover}
          render={(targetID, drop) => (
            <DnDSourceSection id={targetID} ref={drop}>
              <Box marginTop={sourceSectionMargin} transition="all 0.5s">
                {(formCategory === 'assessment' ||
                  formToEdit?.formCategory === 'assessment') && (
                  <Input
                    label="Formulartitel"
                    placeholder="z.B. Einzelinterview"
                    name="formTitle"
                    ref={register}
                    errors={errorsFor(errors, 'formTitle')}
                  />
                )}
                <H6 style={{marginTop: 0}}>DRAG &amp; DROP</H6>
                <DragAndDropList>{FormSource}</DragAndDropList>
                {(formCategory === 'application' ||
                  formToEdit?.formCategory === 'application') && (
                  <>
                    <Box marginTop={20}>
                      <Link href={iframeSrc} newTab>
                        Direktlink
                      </Link>
                    </Box>
                    <Box marginTop={20}>
                      <Typography
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={copyCode}
                      >
                        Form einbinden
                        <Clipboard
                          style={{
                            marginLeft: spacing.scale100,
                            height: spacing.scale300,
                            width: 'auto',
                          }}
                        />
                      </Typography>
                      <FormCodeTextarea
                        rows={20}
                        id="form-code"
                        onClick={copyCode}
                        defaultValue={formCode}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </DnDSourceSection>
          )}
        />
      </Box>
    </>
  );
};

const DnDWrapper = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <FormBuilder />
    </DndProvider>
  );
};

DnDWrapper.getLayout = getDashboardLayout;
export default withAdmin(DnDWrapper);

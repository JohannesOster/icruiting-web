import React, {useState, useCallback, useRef, useEffect, useMemo} from 'react';
import {v4 as uuidv4} from 'uuid';
import {DndProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {useTheme} from 'styled-components';
import {useForm} from 'react-hook-form';
import useSWR from 'swr';
import {Button, Input, Dialog, useToaster} from 'icruiting-ui';
import {errorsFor} from 'lib/react-hook-form-errors-for';
import {H3, H6, Box, Typography, getDashboardLayout} from 'components';
import {Clipboard} from 'icons';
import {
  DnDFormField,
  DnDSection,
  DnDSourceItem,
} from 'components/FormBuilder/DnD';
import {DnDItem, ComponentToEdit} from 'components/FormBuilder/types';
import {EditFormFieldForm} from 'components/FormBuilder/EditFormFieldForm';
import {getSourceFormFields} from 'components/FormBuilder/sourceFormFields';
import {getInitialFormFields} from 'components/FormBuilder/initialFormFields';
import {
  DragAndDropList,
  IconContainer,
  ButtonGroup,
  Overlay,
  DnDSourceSection,
  DnDTargetSection,
  FormGrid,
  FormCodeTextarea,
} from 'components/FormBuilder/FormBuilder.sc';
import {API, FormCategory} from 'services';
import amplifyConfig from 'amplify.config';
import {converter} from 'components/FormBuilder/converter';
import {useRouter} from 'next/router';
import {withAdmin} from 'components';
import {useFormBuilder} from 'components/FormBuilder/useFormBuilder';

type Query = {
  formId?: string;
  formCategory?: FormCategory;
  jobId: string;
};

const FormBuilder: React.FC = () => {
  const {colors, spacing} = useTheme();
  const toaster = useToaster();
  const router = useRouter();
  const {formId: formIdEdit, formCategory, jobId} = router.query as Query;

  const [status, setStatus] = useState('idle');
  const formId = useRef(formIdEdit || uuidv4());

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
    defaultValues: {formTitle: formToEdit?.formTitle},
    criteriaMode: 'all',
  });

  useEffect(() => {
    if (!formToEdit) return;
    reset({formTitle: formToEdit?.formTitle});
  }, [formToEdit, reset]);

  const [
    componentToEdit,
    setComponentToEdit,
  ] = useState<null | ComponentToEdit>(null);
  const sourceItems = getSourceFormFields(
    formToEdit?.formCategory || formCategory,
  );
  const initialformFields = useMemo(
    () =>
      formToEdit
        ? formToEdit.formFields
            .map(converter.toDnDItem)
            .sort((one, two) => one.rowIndex - two.rowIndex)
        : getInitialFormFields(formCategory),
    [formToEdit],
  );

  const {formFields, ...formBuilder} = useFormBuilder(initialformFields);

  useEffect(() => {
    if (!formToEdit) return;
    formFields.reset(initialformFields);
  }, [initialformFields]);

  const showEditItemForm = useCallback(
    (id: string) => {
      const {component, props} = formFields.fields.filter(
        (item) => item.id === id,
      )[0];
      setComponentToEdit({id, component, props});
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
  const Form = formFields.fields.map((item: DnDItem) => {
    const Component = item.as;
    return (
      <DnDFormField
        key={item.id}
        id={item.id}
        rowIndex={item.rowIndex}
        addItem={formFields.insert}
        onMove={formFields.move}
        onDuplicate={formFields.duplicate}
        onDelete={item.deletable ? formFields.delete : undefined}
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
      jobId,
      formCategory: formToEdit?.formCategory || formCategory,
      formTitle: getValues().formTitle,
      formFields: formFields.fields.map(converter.toAPIFormField),
    };

    const request = formToEdit ? API.forms.update : API.forms.create;
    const sucessMsg = !formToEdit
      ? 'Formular erfolgreich erstellt.'
      : 'Formular erfolgreich bearbeitet!';

    request(form)
      .then(() => {
        toaster.success(sucessMsg);
        router.back();
      })
      .catch((error) => {
        toaster.danger(error.message);
        setStatus('idle');
      });
  };

  /** private on Drop to automatically show edit form for new items */
  const _onDrop = () => {
    const tmp = formBuilder.onDrop();
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
      toaster.danger('Fehlgeschlagen. Bitte kopieren Sie den Code manuell!');
    }
  };

  return (
    <>
      {componentToEdit && job && (
        <Dialog onClose={() => setComponentToEdit(null)}>
          <EditFormFieldForm
            componentToEdit={componentToEdit}
            onSubmit={(values) => {
              formFields.edit(componentToEdit.id, values);
              setComponentToEdit(null);
            }}
            formCategory={formToEdit?.formCategory || formCategory}
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
          onHover={formBuilder.onOutsideHover}
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
          onHover={formBuilder.onOutsideHover}
          render={(targetID, drop) => (
            <DnDSourceSection id={targetID} ref={drop}>
              <Box transition="all 0.5s">
                {(['assessment', 'onboarding'].includes(formCategory) ||
                  ['assessment', 'onboarding'].includes(
                    formToEdit?.formCategory,
                  )) && (
                  <Input
                    label="Formulartitel"
                    placeholder="z.B. Einzelinterview"
                    name="formTitle"
                    ref={register({
                      required: 'Formulartitel ist verpflichtend!',
                    })}
                    errors={errorsFor(errors, 'formTitle')}
                  />
                )}
                <H6 style={{marginTop: 0}}>DRAG &amp; DROP</H6>
                <DragAndDropList>{FormSource}</DragAndDropList>
                {(formCategory === 'application' ||
                  formToEdit?.formCategory === 'application') && (
                  <>
                    <Box display="grid" rowGap={spacing.scale200}>
                      <Box marginTop={20}>
                        <Typography
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onClick={copyCode}
                        >
                          Formular einbinden
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
                      <Input
                        type="file"
                        label=".json Datei importieren"
                        onChange={(event) => {
                          const {files} = event.target;
                          const file = files[0];
                          if (!file) return;
                          const fileReader = new FileReader();
                          fileReader.onload = () => {
                            const json = fileReader.result as string;
                            const result = JSON.parse(json);
                            const _formFields = result.formFields
                              .map(converter.toDnDItem)
                              .sort((one, two) => one.rowIndex - two.rowIndex);
                            formFields.reset(_formFields);
                          };
                          fileReader.readAsText(file);
                        }}
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

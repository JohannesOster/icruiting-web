import React, {FC} from 'react';
import {Box, H3, H6, Typography} from 'components';
import {useTheme} from 'styled-components';
import Link from 'next/link';

const Privacy: FC = () => {
  const {spacing} = useTheme();

  return (
    <Box display="flex" justifyContent="center">
      <Box
        padding={spacing.scale400}
        display="grid"
        rowGap={spacing.scale200}
        maxWidth="800px"
      >
        <H3 style={{marginTop: 0}}>Datenschutzerklärung </H3>
        <Typography kind="secondary">Stand: November 2020</Typography>
        <Typography>
          Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen.
          Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der
          gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen
          Datenschutzinformationen informieren wir Sie über die wichtigsten
          Aspekte der Datenverarbeitung im Rahmen unserer Website. <br />
          Beim Besuch unserer Webseite wird Ihre IP-Adresse, Beginn und Ende der
          Sitzung für die Dauer dieser Sitzung erfasst. Dies ist technisch
          bedingt und stellt damit ein berechtigtes Interesse iSv Art 6 Abs 1
          lit f DSGVO dar. Soweit im Folgenden nichts anderes geregelt wird,
          werden diese Daten von uns nicht weiterverarbeitet.
        </Typography>
        <H6>Verantwortliche</H6>
        <Typography>
          Die Datenverarbeitung auf dieser Website erfolgt durch den
          Websitebetreiber. Dessen Kontaktdaten können Sie dem{' '}
          <Link href="/impressum">
            <a>Impressum</a>
          </Link>{' '}
          dieser Website entnehmen.
        </Typography>
        <H6>Ihre Rechte</H6>
        <Typography>
          Ihnen stehen bezüglich Ihrer bei uns gespeicherten Daten grundsätzlich
          die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung,
          Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben,
          dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt
          oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise
          verletzt worden sind, können Sie bei der österreichischen
          Datenschutzbehörde, welche unter{' '}
          <a
            href="https://www.dsb.gv.at/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.dsb.gv.at/
          </a>{' '}
          zu finden ist, beschweren.
        </Typography>
        <H6>TLS-Verschlüsselung</H6>
        <Typography>
          Wir verwenden https um Daten abhörsicher im Internet zu übertragen
          <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE&tid=121248723">
            (Datenschutz durch Technikgestaltung Artikel 25 Absatz 1 DSGVO).
          </a>{' '}
          Durch den Einsatz von TLS (Transport Layer Security), einem
          Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet
          können wir den Schutz vertraulicher Daten sicherstellen. Sie erkennen
          die Benutzung dieser Absicherung der Datenübertragung am kleinen
          Schlosssymbol links oben im Browser und der Verwendung des Schemas
          https (anstatt http) als Teil unserer Internetadresse.
        </Typography>
        <H6>Externes Hosting</H6>
        <Typography>
          Wir nutzen die Dienste von Heroku (Der Service wird von
          Salesforce.com, Inc., San Francisco, California 94105, angeboten). Die
          von uns genutzten Server befinden sich in Dublin. Weitere
          Informationen zur Datennutzung durch Heroku erhalten Sie in der
          Datenschutzerklärung von Heroku:{' '}
          <a
            href="https://www.salesforce.com/company/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.salesforce.com/company/privacy/
          </a>{' '}
          . Rechtsgrundlage ist unser berechtigtes Interesse des Betriebes und
          des Erhalts der Betriebssicherheit dieser Webseiten gemäß Art. 6 Abs.
          1 S. 1 lit. f DSGVO.
          <br />
          <br />
          Das Frontend dieser Website selbst wird auf Servern von Netlify, Inc.,
          2325 3rd Street, Suite 215, San Francisco, 94107 CA, USA, („NF“)
          gehostet. Das Hosting erfolgt dabei außerhalb der EU. Über die weitere
          Art der Verarbeitung sowie über die Dauer der Speicherung der Daten
          haben wir keine Kenntnis. Näher Informationen finde Sie unter{' '}
          <a
            href="https://www.netlify.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.netlify.com/privacy/
          </a>
          Rechtsgrundlage ist unser berechtigtes Interesse des Betriebes und des
          Erhalts der Betriebssicherheit dieser Webseiten gemäß Art. 6 Abs. 1 S.
          1 lit. f DSGVO.
        </Typography>
        <H6>Datenspeicherung</H6>
        <Typography>
          Für die Dantenspeicherung verwenden wir Dienste von Amazon Web
          Services, Inc., 410 Terry Avenue North, Seattle WA 98109, USA,
          („AWS“). . <br />
          Zusätzlich greifen wir für die Speicherung von Dokumente, welche
          sowhol direkt auf der Website als auch über ein von icruiting
          bereitgesteltes Bewerbungsformular hochgeladen werden auf das Produkte
          „S3“ von AWS zurück, der unsere Daten im Auftrag verarbeitet. Dabei
          erfolgt die Verabeitung und Speicherung ausschließlich im
          AWS-Rechenzentrum in Frankfurt a.M. AWS ist ferner
          Privacy-Shield-zertifiziert und garantiert damit, auch außerhalb des
          europäischen Wirtschaftsraums die personenbezogenen Daten entsprechend
          europäischer Datenschutzgesetze zu verarbeiten.
          <br />
          Die Einbeziehung von AWS und Heroku erfolgt auf Grundlage unserer
          berechtigten Interesse des Betriebes und des Erhalts der
          Betriebssicherheit dieser Webseiten gem. Art. 6 Abs. 1 lit. f. DS-GVO.
        </Typography>
        <H6>Zahlungen</H6>
        <Typography>
          Bei der Zahlung mittels Lastschriftverfahren erfolgt die
          Zahlungsabwicklung über Dienste des Zahlungsdienstleisters Stripe
          Payments Europe Ltd, Block 4, Harcourt Centre, Harcourt Road, Dublin
          2, Irland. Nähere Informationen zum Datenschutz von Stripe finden Sie
          unter https://stripe.com/de/privacy#translation.
        </Typography>
        <H6>Registrierung, Anmeldung, Nutzerkonto</H6>
        <Typography>
          Wir verwenden Amazon Cognito von AWS für Authorisierungsdienste. Dafür
          werden die im Zuge der Registrierung sowie dem Login angegebene Daten
          (Name, E-Mail-Adresse, Passwort) AWS übermitelt. Hierbei werden die
          empfangenen Daten in Frankfurt abgespeichert. Nähere Informationen
          finden Sie auf{' '}
          <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/data-protection.html">
            https://docs.aws.amazon.com/cognito/latest/developerguide/data-protection.html
          </a>
          . Rechtsgrundlage für die Einbeziehung von AWS Cognito ist unser
          berechtigtes Interesse des Betriebes und des Erhalts der
          Betriebssicherheit dieser Webseiten gemäß Art. 6 Abs. 1 S. 1 lit. f
          DSGVO.
        </Typography>
      </Box>
    </Box>
  );
};

export default Privacy;

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Tratamiento de Datos Personales | Zafta Repostería",
  description:
    "Política de tratamiento de datos personales de Zafta Repostería",
};

export default function PoliticaDeDatosPage() {
  return (
    <div className="container max-w-4xl mx-auto pt-32 pb-12 px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center leading-tight">
        Política de Tratamiento de Datos Personales
      </h1>

      <div className="prose prose-lg max-w-none font-sans space-y-6">
        {/* Company Information */}
        <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <h2 className="text-2xl font-bold text-primary mb-4">
            ZAFTA REPOSTERÍA
          </h2>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Razón social:</strong> ZAFTA REPOSTERÍA
            </p>
            <p>
              <strong>NIT:</strong> 1017151315-5
            </p>
            <p>
              <strong>Domicilio:</strong> Medellín, Antioquia
            </p>
            <p>
              <strong>Teléfono:</strong> 3217590897
            </p>
            <p>
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:ventas@zaftareposteria.com"
                className="text-primary hover:underline"
              >
                ventas@zaftareposteria.com
              </a>
            </p>
            <p>
              <strong>Página web:</strong>{" "}
              <a
                href="https://www.zaftareposteria.com"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.zaftareposteria.com
              </a>
            </p>
          </div>
        </section>

        {/* Target Audience */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            A Quién Va Dirigida Esta Política
          </h2>
          <p className="leading-relaxed">
            Esta política aplica para todos los titulares de información
            personal que sea utilizada y/o se encuentre en las bases de datos de
            la compañía ZAFTA REPOSTERÍA.
          </p>
        </section>

        {/* Legal Framework */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Normatividad Legal y Ámbito de Aplicación
          </h2>
          <p className="leading-relaxed">
            La presente política de Tratamiento de datos personales es elaborada
            de conformidad con lo dispuesto en la Constitución Política, la Ley
            1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demás
            disposiciones complementarias y será aplicada por ZAFTA REPOSTERÍA
            respecto de la recolección, almacenamiento, uso, circulación,
            supresión y de todas aquellas actividades que constituyan
            tratamiento de datos personales.
          </p>
          <p className="leading-relaxed">
            ZAFTA REPOSTERÍA está comprometida con el respeto y garantía de los
            derechos de sus clientes, empleados y terceros en general. Por eso
            adopta el siguiente manual de políticas y procedimientos de
            tratamiento de Información, de obligatoria aplicación en todas las
            actividades que involucre, total o parcialmente, la recolección, el
            almacenamiento, el uso, la circulación y transferencia de esa
            información.
          </p>
          <p className="leading-relaxed">
            Estas políticas son de obligatorio y estricto cumplimiento para
            ZAFTA REPOSTERÍA en calidad de responsable, así como todos los
            terceros que obran en nombre de la Compañía, o que sin actuar en
            nombre de ZAFTA REPOSTERÍA tratan datos personales por disposición
            de ésta como encargados.
          </p>
          <p className="leading-relaxed">
            Cualquier incumplimiento de las obligaciones y, en general, de las
            políticas contenidas en este documento debe ser reportado a: ZAFTA
            REPOSTERÍA{" "}
            <a
              href="mailto:ventas@zaftareposteria.com"
              className="text-primary hover:underline"
            >
              ventas@zaftareposteria.com
            </a>
          </p>
        </section>

        {/* Definitions */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Definiciones</h2>
          <p className="leading-relaxed mb-3">
            Para efectos de la ejecución de la presente política y de
            conformidad con la normatividad legal, serán aplicables las
            siguientes definiciones:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Autorización:</strong> Consentimiento previo, expreso e
              informado del Titular para llevar a cabo el Tratamiento de datos
              personales.
            </li>
            <li>
              <strong>Aviso de privacidad:</strong> Documento físico,
              electrónico o en cualquier otro formato generado por el
              Responsable que se pone a disposición del Titular para el
              tratamiento de sus datos personales.
            </li>
            <li>
              <strong>Base de Datos:</strong> Conjunto organizado de datos
              personales que sea objeto de Tratamiento.
            </li>
            <li>
              <strong>Dato personal:</strong> Cualquier información vinculada o
              que pueda asociarse a una o varias personas naturales determinadas
              o determinables.
            </li>
            <li>
              <strong>Dato público:</strong> Es el dato calificado como tal
              según los mandatos de la ley o de la Constitución Política y aquel
              que no sea semiprivado, privado o sensible.
            </li>
            <li>
              <strong>Dato privado:</strong> Es el dato que por su naturaleza
              íntima o reservada sólo es relevante para el titular.
            </li>
            <li>
              <strong>Datos sensibles:</strong> Aquellos que afectan la
              intimidad del Titular o cuyo uso indebido puede generar su
              discriminación.
            </li>
            <li>
              <strong>Encargado del Tratamiento:</strong> Persona natural o
              jurídica, pública o privada, que por sí misma o en asocio con
              otros, realice el Tratamiento de datos personales por cuenta del
              Responsable del Tratamiento.
            </li>
            <li>
              <strong>Responsable del Tratamiento:</strong> Persona natural o
              jurídica, pública o privada, que por sí misma o en asocio con
              otros, decida sobre la base de datos y/o el Tratamiento de los
              datos.
            </li>
            <li>
              <strong>Titular:</strong> Persona natural cuyos datos personales
              sean objeto de Tratamiento.
            </li>
            <li>
              <strong>Tratamiento:</strong> Cualquier operación o conjunto de
              operaciones sobre datos personales, tales como la recolección,
              almacenamiento, uso, circulación o supresión de los mismos.
            </li>
          </ul>
        </section>

        {/* Purpose */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Finalidad de la Recolección y Tratamiento de Datos
          </h2>
          <p className="leading-relaxed mb-3">
            En ejercicio de su objeto social, ZAFTA REPOSTERÍA realiza el
            tratamiento de datos personales de sus empleados, proveedores,
            clientes, accionistas y usuarios. La finalidad del tratamiento va
            dirigida a:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              Ejecutar la relación contractual existente con sus clientes,
              proveedores y trabajadores.
            </li>
            <li>
              Proveer los servicios y/o los productos requeridos por sus
              usuarios.
            </li>
            <li>
              Informar sobre nuevos productos o servicios y/o sobre cambios en
              los mismos.
            </li>
            <li>Evaluar la calidad del servicio.</li>
            <li>Realizar estudios internos sobre hábitos de consumo.</li>
            <li>
              Enviar información comercial, publicitaria o promocional sobre
              productos, servicios, eventos y promociones.
            </li>
            <li>Soportar procesos de auditoría interna o externa.</li>
            <li>
              Registrar la información de empleados y/o pensionados en las bases
              de datos.
            </li>
            <li>
              Dar cumplimiento a las obligaciones derivadas de relaciones
              laborales y trámites ante autoridades.
            </li>
            <li>
              Atender requerimientos del área administrativa y de recursos
              humanos.
            </li>
            <li>Notificar a familiares en caso de emergencias.</li>
            <li>
              Consultar y evaluar información en centrales de riesgo crediticio,
              financiero, de antecedentes judiciales o de seguridad.
            </li>
          </ul>
        </section>

        {/* Minors Data */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Tratamiento de Datos de Niños, Niñas y Adolescentes
          </h2>
          <p className="leading-relaxed">
            El Tratamiento de datos personales de niños, niñas y/o adolescentes
            que sean de naturaleza pública, cumplirá con los siguientes
            parámetros:
          </p>
          <ul className="space-y-2 list-disc list-inside mt-3">
            <li>
              Respetar el interés superior de los niños, niñas y adolescentes.
            </li>
            <li>Asegurar el respeto de sus derechos fundamentales.</li>
            <li>
              Valorar la opinión del menor cuando este cuente con la madurez,
              autonomía y capacidad para entender el asunto.
            </li>
            <li>
              El representante legal podrá otorgar la autorización para el
              tratamiento de los datos personales.
            </li>
          </ul>
        </section>

        {/* Sensitive Data */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Tratamiento de Datos Sensibles
          </h2>
          <p className="leading-relaxed">
            ZAFTA REPOSTERÍA observará estrictamente las limitaciones legales al
            tratamiento de datos sensibles, requiriendo autorización explícita
            del titular, salvo excepciones legales específicas para salvaguardar
            intereses vitales, actividades de organizaciones sin ánimo de lucro,
            defensa de derechos en procesos judiciales, o fines históricos,
            estadísticos o científicos.
          </p>
        </section>

        {/* Video Surveillance */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Video-Vigilancia
          </h2>
          <p className="leading-relaxed">
            La información recolectada por ZAFTA REPOSTERÍA se utilizará para
            fines de seguridad de las personas, los bienes e instalaciones. Esta
            información puede ser empleada como prueba en cualquier tipo de
            proceso y ante cualquier tipo de autoridad y organización.
          </p>
        </section>

        {/* Rights */}
        <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Derechos de los Titulares
          </h2>
          <p className="leading-relaxed mb-3">
            El titular de los datos personales tiene los siguientes derechos:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Conocer, actualizar y rectificar sus datos personales.</li>
            <li>Solicitar la prueba de la autorización otorgada.</li>
            <li>
              Ser informado del uso que se le ha dado a sus datos personales.
            </li>
            <li>
              Presentar quejas ante la Superintendencia de Industria y Comercio.
            </li>
            <li>
              Revocar la autorización y/o solicitar la supresión del dato en
              cualquier momento.
            </li>
            <li>
              Acceder en forma gratuita a sus datos personales objeto de
              tratamiento.
            </li>
          </ul>
        </section>

        {/* Procedure */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Procedimiento para Ejercer los Derechos
          </h2>
          <p className="leading-relaxed mb-3">
            Para consultas, reclamos, quejas o para el ejercicio de los derechos
            que le asisten como titular de información, podrá comunicarse con
            ZAFTA REPOSTERÍA así:
          </p>
          <div className="bg-accent/30 p-4 rounded-lg border border-accent">
            <p className="font-semibold mb-2">Información de Contacto:</p>
            <p>
              <strong>Correo electrónico:</strong>{" "}
              <a
                href="mailto:ventas@zaftareposteria.com"
                className="text-primary hover:underline"
              >
                ventas@zaftareposteria.com
              </a>
            </p>
            <p>
              <strong>Teléfono:</strong> 3217590897
            </p>
            <p>
              <strong>Horario:</strong> Lunes a viernes: 7:30 a.m. a 5:30 p.m
            </p>
          </div>
          <p className="leading-relaxed mt-4">
            La solicitud debe contener: firma, número de identificación,
            documentos de identidad, datos de contacto, descripción clara de los
            datos y hechos que dan lugar a la solicitud, y documentos anexos.
          </p>
          <p className="leading-relaxed">
            <strong>Tiempos de respuesta:</strong> Las consultas serán atendidas
            en un término máximo de 10 días hábiles. Las solicitudes o reclamos
            en un término máximo de 15 días hábiles.
          </p>
        </section>

        {/* Suppression */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Supresión de Datos
          </h2>
          <p className="leading-relaxed">
            El titular podrá solicitar la supresión de sus datos cuando
            considere que no están siendo tratados conforme a la ley, hayan
            dejado de ser necesarios, o se haya superado el periodo estipulado
            para su tratamiento. Este derecho no es absoluto y puede ser negado
            cuando el titular tenga un deber legal o contractual de permanecer
            en la base de datos, o cuando los datos sean necesarios para
            proteger intereses jurídicamente tutelados.
          </p>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Seguridad de la Información
          </h2>
          <p className="leading-relaxed">
            ZAFTA REPOSTERÍA ha adoptado medidas técnicas, administrativas y
            humanas razonables para proteger la información de los titulares e
            impedir adulteración, pérdida, consulta, uso o acceso no autorizado
            o fraudulento.
          </p>
        </section>

        {/* Privacy Notice */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Aviso de Privacidad
          </h2>
          <p className="leading-relaxed">
            ZAFTA REPOSTERÍA informa que el aviso de privacidad de tratamiento
            de sus datos personales puede consultarlo en{" "}
            <a
              href="https://www.zaftareposteria.com"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.zaftareposteria.com
            </a>
          </p>
        </section>

        {/* Validity */}
        <section className="bg-accent/30 p-6 rounded-lg border border-accent">
          <h2 className="text-2xl font-bold text-primary mb-4">Vigencia</h2>
          <p className="leading-relaxed">
            La autorización por parte del titular, para el tratamiento de los
            datos personales, tendrá vigencia de cinco (5) años más contados
            desde la terminación de la última relación contractual.
          </p>
          <p className="leading-relaxed mt-3">
            <strong>
              La presente Política de Tratamiento de Datos Personales rige a
              partir del 1 de noviembre de 2016.
            </strong>
          </p>
        </section>

        {/* Cross-reference */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Consulte también nuestro{" "}
          <a
            href="/aviso-de-privacidad"
            className="text-primary hover:underline font-medium"
          >
            Aviso de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}

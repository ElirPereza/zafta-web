import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Zafta Repostería",
  description: "Aviso de privacidad de Zafta Repostería",
};

export default function AvisoDePrivacidadPage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        Aviso de Privacidad
      </h1>

      <div className="prose prose-lg max-w-none font-sans space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            Protección de Datos Personales
          </h2>

          <p className="leading-relaxed">
            <strong>ZAFTA REPOSTERÍA</strong> se permite informar que:
          </p>

          <p className="leading-relaxed">
            En cumplimiento a lo estipulado en la Ley 1581 de 2012 y a lo previsto en el numeral 3
            y el parágrafo del artículo 10 del Decreto 1377 de 2013, con el objeto de informar a
            todas las personas cuyos datos personales se encuentran en nuestras bases de datos, y
            teniendo en cuenta la imposibilidad de solicitar autorización en forma individual,
            ZAFTA REPOSTERÍA informa que hace uso del mecanismo alternativo establecido en el citado
            numeral y manifiesta que los datos personales incluidos en sus bases de datos se han
            recopilado para el desarrollo de diversos procedimientos relacionados directamente con
            su objeto social.
          </p>

          <p className="leading-relaxed">
            El uso y manejo de los mismos, se efectúa bajo estrictos estándares de responsabilidad,
            dentro de los cuales está el respeto al debido proceso y a la protección de la información.
          </p>

          <p className="leading-relaxed">
            Los datos registrados en nuestras bases de datos son, entre otros: reseñas públicas,
            tales como dirección, teléfonos, correos electrónicos, número de identificación y fecha
            de nacimiento. En todo caso en cualquier momento el titular de la información podrá
            revocar su consentimiento y ejercer su derecho a la supresión de datos personales
            consagrado en la Ley 1581 de 2012.
          </p>
        </section>

        <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <h3 className="text-xl font-semibold text-primary mb-3">
            Consulta y Supresión de Datos
          </h3>

          <p className="leading-relaxed mb-4">
            Si Usted desea consultar información o solicitar la supresión de sus datos personales
            de nuestras bases de datos, agradecemos se comunique dentro de los 30 días siguientes
            a la publicación del presente aviso a la dirección de correo electrónico:
          </p>

          <p className="font-medium text-primary">
            <a href="mailto:mayomedinao@gmail.com" className="hover:underline">
              mayomedinao@gmail.com
            </a>
            {" o "}
            <a href="mailto:ventas@alfarerapuebloviejo.com" className="hover:underline">
              ventas@alfarerapuebloviejo.com
            </a>
          </p>

          <p className="leading-relaxed mt-4 text-sm text-muted-foreground">
            Si decide no hacerlo, vencido el referido plazo, consideraremos autorizado el
            tratamiento de sus datos personales. Lo anterior, sin perjuicio del derecho que asiste
            al titular de información en cualquier tiempo de consultar, conocer, actualizar sus
            datos personales, o solicitar su supresión o rectificación.
          </p>
        </section>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Para más información por favor consulte la{" "}
          <a href="/politica-de-datos" className="text-primary hover:underline font-medium">
            Política de Tratamiento de Información
          </a>
          .
        </p>
      </div>
    </div>
  );
}

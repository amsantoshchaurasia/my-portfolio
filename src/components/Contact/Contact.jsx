import Container from "../common/Container";
import SectionAnimation from "../common/SectionAnimation";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[#0B1120] text-white scroll-mt-16 sm:scroll-mt-13 md:scroll-mt-18 lg:scroll-mt-14 xl:scroll-mt-24 pt-6 sm:pt-12 md:pt-6 lg:pt-6 xl:pt-6 2xl:pt-10 pb-10 sm:pb-20 lg:pb-8 xl:pb-4 2xl:pb-12"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADING (matches Experience heading style)
          ======================================== */}

          <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl 2xl:max-w-4xl text-center">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[8px] text-blue-400">
              Contact
            </p>

            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl 2xl:text-6xl font-black">
              Get In Touch
            </h2>

            <p className="mt-3 sm:mt-6 lg:mt-3 text-xs sm:text-base md:text-lg leading-5 sm:leading-7 md:leading-8 text-gray-400 px-2">
              Interested in working together or discussing an
              opportunity? Feel free to send me a message. I'll get
              back to you as soon as possible.
            </p>

          </div>

          {/* ========================================
              CONTACT FORM
          ======================================== */}

          <div className="mt-6 sm:mt-10 md:mt-8 lg:mt-5 2xl:mt-10 mx-auto max-w-xl 2xl:max-w-2xl">
            <ContactForm />
          </div>

        </SectionAnimation>
      </Container>
    </section>
  );
}
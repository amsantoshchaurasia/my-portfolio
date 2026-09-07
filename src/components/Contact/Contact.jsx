import Container from "../Common/Container";
import SectionAnimation from "../Common/SectionAnimation";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[#0B1120] text-white py-24"
    >
      <Container>
        <SectionAnimation>
          {/* Heading */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="uppercase tracking-[6px] text-blue-400 font-semibold text-sm">
              Contact
            </p>

            <h2 className="mt-3 text-4xl md:text-5xl font-black">
              Get In Touch
            </h2>

            <p className="mt-5 text-gray-400 leading-7 text-sm md:text-base">
              Interested in working together or discussing an opportunity?
              Feel free to send me a message. I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Form Container */}
          <div className="mt-12 max-w-xl mx-auto">
            <ContactForm />
          </div>
        </SectionAnimation>
      </Container>
    </section>
  );
}
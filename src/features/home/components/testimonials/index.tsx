import "./styles.css";

import type { JSX } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Testimonial = {
  content: string;
  name: string;
  designation: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    content:
      "Abhisek developed a fully functional website for us with both frontend and backend capabilities. He ensured every requirement was met while paying close attention to detail. His dedication, technical skill, and commitment to quality are reflected in both the functionality and overall experience of the final product.",
    name: "Umang Dayal",
    designation: "Product Designer | B2B & AI Products",
    avatar: "/testimonials/umang-dayal.png",
  },
  {
    content:
      "Working with Abhisek was a valuable experience. The project was well organized, collaboration was smooth, and the environment encouraged learning and growth. His attention to quality and willingness to support the team made a meaningful impact throughout the project.",
    name: "Priya Sharma",
    designation: "UI/UX Designer",
    avatar: "/testimonials/priya-sharma.png",
  },
  {
    content:
      "The collaboration was both enjoyable and educational. I gained a deeper understanding of project structure, maintainable code, and professional development practices. Communication remained clear throughout, making the entire experience productive and rewarding.",
    name: "Rahul Verma",
    designation: "Frontend Developer",
    avatar: "/testimonials/rahul-verma.png",
  },
  {
    content:
      "Communication was always clear, expectations were well defined, and the workflow remained structured from start to finish. The collaborative approach created a productive environment and made it easy to move the project forward with confidence.",
    name: "Ananya Patel",
    designation: "Brand Designer",
    avatar: "/testimonials/ananya-patel.png",
  },
  {
    content:
      "What stood out most was the combination of trust, clarity, and thoughtful decision-making. Every discussion focused on finding the right solution rather than simply completing tasks, which made the collaboration both effective and enjoyable.",
    name: "Michael Carter",
    designation: "Product Consultant",
    avatar: "/testimonials/michael-carter.png",
  },
];

export default function Testimonials(): JSX.Element {
  return (
    <section className="testimonials" aria-labelledby="testimonials-heading">
      <span className="testimonials__kicker kicker">Testimonials</span>

      <h2 id="testimonials-heading" className="testimonials__heading">
        What People Say About <br />
        Working Together
      </h2>

      <Carousel
        opts={{
          loop: true,
        }}
        className="testimonials__carousel"
      >
        <CarouselContent className="testimonials__carousel-content">
          {testimonials.map((testimonial, index) => (
            <CarouselItem className="testimonials__carousel-item" key={index}>
              <article className="testimonials__card">
                <blockquote className="testimonials__card-quote">
                  <p className="testimonials__card-content">
                    {testimonial.content}
                  </p>
                </blockquote>

                <footer className="testimonials__card-profile">
                  <Avatar
                    size="lg"
                    className="testimonials__card-profile-avatar"
                  >
                    <AvatarImage
                      className="testimonials__card-profile-avatar-image"
                      src={testimonial.avatar}
                      alt={`${testimonial.name} avatar`}
                    />

                    <AvatarFallback className="testimonials__card-profile-avatar-fallback">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="testimonials__card-profile-info">
                    <p className="testimonials__card-profile-name">
                      {testimonial.name}
                    </p>

                    <p className="testimonials__card-profile-designation">
                      {testimonial.designation}
                    </p>
                  </div>
                </footer>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="testimonials__carousel-action testimonials__carousel-action-prev" />
        <CarouselNext className="testimonials__carousel-action testimonials__carousel-action-next" />
      </Carousel>
    </section>
  );
}

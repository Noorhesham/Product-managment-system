import React from "react";
import Heading from "./Heading";

const Section = ({ className, header ,children}: { className?: string; header: string ,children: React.ReactNode}) => {
  return (
    <section className={`${className} w-full relative py-6 px-10`}>
      {header && <Heading  text={header} />}
      {children}
    </section>
  );
};

export default Section;

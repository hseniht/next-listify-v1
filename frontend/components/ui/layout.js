export const Section = ({ id, className, children }) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

export const PageWrapper = ({ id, className, children }) => {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#303b44] ">
      <div className="max-w-screen-xl mx-auto p-4 md:py-8">
        <hr className="my-6 lg:my-8 border-gray-500" />
        <span className="block text-sm text-center text-[#f8f8ff]">
          Personal pet project by{" "}
          <a
            href="https://www.linkedin.com/in/sergey-dolzhenko/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Sergey Dolzhenko
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

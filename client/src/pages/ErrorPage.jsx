import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="container mx-auto my-10 lg:my-24 p-4">
      <div className="flex flex-col items-center justify-center gap-10  h-[50vh]">
        <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
          Page Not Found
        </h2>
        <Link className="p-2 rounded text-white uppercase bg-[#376bc0] hover:bg-[#2f5aad] transition-colors duration-300 ease-in-out cursor-pointer">
          Go Back Home
        </Link>
      </div>
    </section>
  );
};

export default ErrorPage;

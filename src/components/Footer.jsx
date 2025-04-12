const Footer = () => {
  return (
    <footer className="backdrop-blur-md bg-white/50 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/20 shadow-xl rounded-xl m-4 transition-colors duration-500 ease-in-out">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-center">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Développé par{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            Thomas S.
          </span>{" "}
          - {new Date().getFullYear()} &copy; Tous droits réservés
        </div>
      </div>
    </footer>
  );
};

export default Footer;
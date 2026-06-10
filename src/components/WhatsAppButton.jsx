const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '94712533693';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello Luxury Sense! I would like to know more about your collection.'
);

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 transition hover:scale-110 active:scale-95 drop-shadow-xl"
    >
      <svg
        width="60"
        height="60"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-14 w-14 sm:h-16 sm:w-16"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 2.825.733 5.58 2.126 8L0 32l8.226-2.09A15.908 15.908 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0z"
          fill="#25D366"
        />
        <path
          d="M23.51 21.08c-.31-.15-1.83-.9-2.11-1-.28-.1-.49-.15-.7.15-.2.3-.78 1-.95 1.18-.17.18-.34.2-.65.05a8.21 8.21 0 01-2.42-1.5c-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.7-1.69-.96-2.31-.25-.61-.51-.53-.7-.54-.18-.01-.38-.01-.58-.01-.2 0-.53.07-.8.37-.28.3-1.06 1.03-1.06 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.25 5.15 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.08-.13-.28-.2-.59-.35z"
          fill="white"
        />
      </svg>
    </a>
  );
}

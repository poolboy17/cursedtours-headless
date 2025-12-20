// Sign-up disabled - redirect to home
export default function SignUpPage() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: true,
    },
  };
}

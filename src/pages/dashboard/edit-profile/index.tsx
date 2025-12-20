// Edit profile disabled - redirect to home
export default function EditProfilePage() {
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

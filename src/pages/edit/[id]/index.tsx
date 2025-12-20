// Post editing disabled - redirect to home
export default function EditPostPage() {
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

// Dashboard disabled - redirect to home
export default function DashboardPage() {
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

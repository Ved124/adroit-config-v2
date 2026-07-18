export default function AdminRedirect() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/admin/machines',
      permanent: false,
    },
  };
}

import React from 'react'

export default function index() {
  return (
    <div>

    </div>
  )
}

export const getServerSideProps = async ({ req, res }) => {
    const session = await getLoginSession(req);
    const user = (session?._doc && (await findUser(session._doc))) ?? null;
    if (!user) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    if (user &&  !user.detailsAvailable) {
      return {
        redirect: {
          destination: "/auth/user/details",
          permanent: false,
        },
      };
    }
    if (user.approved) {
      return {
        redirect: {
          destination: `/dashboard/${user.category}`,
          permanent: false,
        },
      };
    }
    if ( user && user.category !== "college") {
      return {
        redirect: {
          destination: `/dashboard/${user.category}`,
          permanent: false,
        },
      };
    }
  
    return {
      props: {},
    };
  };

  

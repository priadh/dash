// // src/components/jobs/useHasPostedJobs.js
// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';

// const useHasPostedJobs = () => {
//   const [hasPosted, setHasPosted] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkPostedJobs = async () => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         setHasPosted(false);
//         setLoading(false);
//         return;
//       }

//       const { data: jobs, error: jobsError } = await supabase
//         .from('jobs')
//         .select('uuid')
//         .eq('user_id', user.id)
//         .limit(1);

//       if (jobsError) {
//         console.error(jobsError);
//         setHasPosted(false);
//       } else {
//         setHasPosted(jobs.length > 0);
//       }

//       setLoading(false);
//     };

//     checkPostedJobs();
//   }, []);

//   return { hasPosted, loading };
// };

// export default useHasPostedJobs;

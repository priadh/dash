import React, { useEffect, useState, useRef,useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { supabase } from '../supabaseClient';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: rgb(0, 0, 0);
    color: #fff; 
    font-family: 'Arial', sans-serif; 
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  background-color: rgb(0, 0, 0);
  min-height: 100vh;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 3rem auto;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  margin-bottom: 60px;
`;

const JobRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #444;
  position: relative;
  transition: 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Left = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-align: left;
  flex: 1;
`;

const Logo = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 6px;
  object-fit: cover;
  background: #333;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Company = styled.span`
  color: #bbb;
  font-size: 12px;
  text-transform: uppercase;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const Meta = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #aaa;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  line-height: 1.3;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
`;

const Time = styled.div`
  color: #bbb;
  font-size: 12px;
`;
const Heading = styled.h1`
  color:rgb(255, 255, 255);
  text-align: center;
  margin: 20px 0 30px;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 1.2px;
`;
const ActionButton = styled.button`
  background: ${({ color }) => color || '#009624'};
  color: white;
  font-weight: 500;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  transition: 0.3s ease;

  &:hover {
    background: ${({ hoverColor }) => hoverColor || '#00c853'};
  }
`;
const SortPillGroup = styled.div`
  display: flex;
  justify-content: center;
  background-color: #1e1e1e;
  border-radius: 999px;
  padding: 4px;
  width: fit-content;
  margin: 0 auto 30px;
  box-shadow: 0 2px 8px rgba(0, 255, 128, 0.1);
`;

const SortPillButton = styled.button`
  padding: 8px 20px;
  border: 1px solid #555;
  border-radius: 999px;
  border: 1px solid ${({ active }) => (active ? '#00c853' : '#444')};
  color: ${({ active }) => (active ? '#000' : '#ccc')};
  font-size: 14px;
  // font-weight: 550;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
    background-color: ${({ active }) => (active ? '#00c853' : '#222')};


  &:hover {
    border-color: #00c853; /* This line forces the border to turn the usual green */
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #1e1e1e;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  color: #fff;

  h2 {
    margin-bottom: 20px;
    font-size: 20px;
  }

  label {
    display: block;
    margin-bottom: 14px;
    font-size: 14px;

    input {
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      background: #111;
      border: 1px solid #444;
      color: #fff;
      margin-top: 6px;
    }
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const AddOnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
`;

const AddOnCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ccc;

  input[type='checkbox'] {
    accent-color: #00e676;
    width: 16px;
    height: 16px;
  }
`;
const inputStyle = {
  padding: '12px',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  outline: 'none',
};

const primaryButton = {
  padding: '12px 20px',
  backgroundColor: '#00ff99',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};

const secondaryButton = {
  ...primaryButton,
  backgroundColor: '#444',
  color: '#fff',
};
const SortBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px auto;
  max-width: 1100px;
  padding: 0 20px;
  flex-wrap: wrap;
`;
const EditorBox = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  max-height: 150px;
  background: #1e1e1e;
  color: #fff;
  overflow-y: auto;

  .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.6;
    text-align: left; /* ✅ force left alignment */
    
    ul, ol {
      padding-left: 1.25rem;
    }

    li {
      margin-left: 0;
      text-indent: 0;
    }

    h1, h2, h3 {
      margin: 0.5rem 0;
      text-align: left; /* ✅ enforce heading left-align */
    }

    p {
      text-align: left; /* ✅ enforce paragraph left-align */
    }
  }
`;


const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0.5rem 0;
`;

const ToolbarButton = styled.button`
  background: ${(props) => (props.active ? '#009624' : '#2d2d2d')};
  border: none;
  border-radius: 6px;
  color: ${(props) => (props.active ? '#fff' : '#ccc')};
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #009624;
    color: white;
  }
`;

const DashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [editingJob, setEditingJob] = useState(null);
const expiredRef = useRef(null);
const basePrice = 99;
const logoPrice = editingJob?.is_repost && editingJob?.logoFile ? 30 : 0;
const featurePrice = editingJob?.featureJob ? 39 : 0;

const editor = useEditor({
  
  extensions: [StarterKit],
  
  content: editingJob?.description || '',
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    setEditingJob((prev) => ({ ...prev, description: html }));
  },
}, [editingJob?.uuid]); // Important to refresh editor on job change

const totalPrice = useMemo(() => {
  if (!editingJob) return 0;

  let price = 0;

  // Base price only for repost
  if (editingJob.is_repost) {
    price += basePrice;
  }

  // If a new logo is added
  const isNewLogo = !editingJob.logoUploadedBefore && editingJob.logoFile;
  if (isNewLogo) {
    price += 30;
  }

  // Feature cost if eligible
  const featuredUntil = editingJob.featured_until
    ? new Date(editingJob.featured_until)
    : null;

  const isAlreadyFeatured = featuredUntil && featuredUntil > new Date();
  const wantsToFeatureNow = editingJob.featureJob && !isAlreadyFeatured;

  if (wantsToFeatureNow) {
    price += 39;
  }

  return price;
}, [editingJob]);



const now = new Date();
const expiredJobs = jobs.filter(job => {
  const postedDate = new Date(job.time);
  const diffInDays = (now - postedDate) / (1000 * 60 * 60 * 24);
  return diffInDays > 30; // 30-day expiry window
});


useEffect(() => {
  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('time', { ascending: sortOrder === 'oldest' });

    if (error) {
      console.error('Error fetching jobs:', error.message);
    } else {
      setJobs(data);
    }
  };

  fetchJobs();
}, [sortOrder]);

{expiredJobs.length > 0 && (
  <>
    <Heading>Expired Jobs</Heading>
    {expiredJobs.map((job) => (
      <JobRow key={job.uuid}>
        {/* ...same Left and Info */}
  <Right>
  <ActionButton
    color="#ff9800"
    hoverColor="#fb8c00"
    onClick={() => handleRepostClick(job)} // ✅ Always allow
  >
    Preview & Repost
  </ActionButton>
</Right>

      </JobRow>
    ))}
  </>
)}

const handleEdit = (job) => {
  const now = new Date();
  const postedDate = new Date(job.time);
  const expiresAt = new Date(postedDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const daysLeft = (expiresAt - now) / (1000 * 60 * 60 * 24);

  const featuredUntil = job.featured_until ? new Date(job.featured_until) : null;
  const isCurrentlyFeatured = featuredUntil && featuredUntil > now;

  const canFeatureNow = !isCurrentlyFeatured && daysLeft >= 7;

  setEditingJob({
    ...job,
    applyLink: job.apply_link || '',
    logoUrl: job.logo_url || '',
    logoUploadedBefore: !!job.logo_url,
    featureJob: job.feature_job || false,
    is_repost: (now - postedDate) / (1000 * 60 * 60 * 24) > 30,
    currentlyFeatured: isCurrentlyFeatured,
    canFeatureNow: canFeatureNow,
  });
};




const handleEditSubmit = async (e) => {
  e.preventDefault();

  let logoUrl = editingJob.logoUrl;
  const isFirstTimeLogoUpload = !editingJob.logoUploadedBefore && editingJob.logoFile;

  if (isFirstTimeLogoUpload) {
    const confirmCharge = window.confirm(`Confirm and Pay $${totalPrice}. Continue?`);
    if (!confirmCharge) return;
  }

  // ✅ Determine if job is *currently* featured
  const originalJob = jobs.find(j => j.uuid === editingJob.uuid);
  const prevFeaturedUntil = originalJob?.featured_until
    ? new Date(originalJob.featured_until)
    : null;
  const isPreviouslyFeatured = prevFeaturedUntil && prevFeaturedUntil > new Date();

  // ✅ Check if user wants to newly feature it
  const wantsToFeatureNow = editingJob.featureJob && !isPreviouslyFeatured;
// Fallback: Prevent feature misuse if condition violated

  if (wantsToFeatureNow) {
    if (!editingJob.canFeatureNow) {
  alert("You can only feature a job if 7+ days remain before it expires.");
  return;
}


    const confirmFeature = window.confirm("Featuring this job for 7 days will cost $39. Continue?");
    if (!confirmFeature) return;
  }
// Fallback: Prevent feature misuse if condition violated
if (editingJob.featureJob && !editingJob.canFeatureNow) {
  console.warn("Feature option is not valid but save continues.");
  editingJob.featureJob = false; // force unset it
}

  // Upload logo if a new file is selected
  if (editingJob.logoFile) {
    const file = editingJob.logoFile;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file);

    if (uploadError) {
      alert('Logo upload failed: ' + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
    logoUrl = data.publicUrl;
  }

  // ✅ Prepare fields for update
  const updatedFields = {
    title: editingJob.title,
    company: editingJob.company,
    location: editingJob.location,
    job_type: editingJob.jobType,
    salary: editingJob.salary,
    description: editingJob.description,
    apply_link: editingJob.applyLink,
    logo_url: logoUrl,
    feature_job: editingJob.featureJob,
  };

  if (wantsToFeatureNow) {
    const newFeaturedUntil = new Date();
    newFeaturedUntil.setDate(newFeaturedUntil.getDate() + 7);
    updatedFields.featured_until = newFeaturedUntil.toISOString();
  }

  const { error } = await supabase
    .from('jobs')
    .update(updatedFields)
    .eq('uuid', editingJob.uuid);

  if (error) {
    alert('Failed to update job: ' + error.message);
  } else {
    setJobs((prev) =>
      prev.map((j) =>
        j.uuid === editingJob.uuid
          ? { ...editingJob, logoUrl, featured_until: updatedFields.featured_until }
          : j
      )
    );
    setEditingJob(null);
  }
};


const handleRepost = async (job) => {
  
const confirm = window.confirm(`Reposting this job will cost $${totalPrice}. Proceed?`);
  if (!confirm) return;

  const now = new Date();
const featuredUntil = new Date();
featuredUntil.setDate(now.getDate() + 7);
const newExpiresAt = new Date();
newExpiresAt.setDate(newExpiresAt.getDate() + 30);
const { error } = await supabase
  .from('jobs')
  .update({
    time: now.toISOString(),
    is_reposted: true,
    feature_job: true,                   // ✅ must include this
    featured_until: featuredUntil.toISOString(), // ✅ must include this
    last_reposted_at: now.toISOString(),
        expires_at: newExpiresAt.toISOString(), // 👈 critical fix
         // ✅ optional but useful
  })
  .eq('uuid', job.uuid);


  if (error) {
    alert("Error reposting job: " + error.message);
  } else {
    alert("Job reposted successfully!");
    setEditingJob(null);
    window.location.reload();
  }
};
const handleRepostSubmit = async (e) => {
  e.preventDefault();
  await handleRepost(editingJob); // reuse existing logic
};


const handleRepostClick = (job) => {
  const now = new Date();
  const featuredUntil = new Date();
  featuredUntil.setDate(now.getDate() + 7);

setEditingJob({
    ...job,
    is_repost: true,
    featureJob: false, // default to unfeatured
    logoUploadedBefore: !!job.logo_url,
    logoUrl: job.logo_url,
    canFeatureNow: true,
    featured_until: null, // ❌ fix: don't pre-fill
  });
};


  const handleDelete = async (job) => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;

    const { error } = await supabase.from('jobs').delete().eq('uuid', job.uuid);

    if (error) {
      alert('Failed to delete job: ' + error.message);
    } else {
      setJobs((prev) => prev.filter((j) => j.uuid !== job.uuid));
      alert('Job deleted successfully.');
    }
  };

return (
    <PageWrapper>
      <GlobalStyle />
                      <Heading>Jobs You Posted</Heading>  {/* Added heYading here */}
                      
            <SortPillGroup>
  <SortPillButton
    active={sortOrder === 'newest'}
    onClick={() => setSortOrder('newest')}
  >
    Newest
  </SortPillButton>
  <SortPillButton
    active={sortOrder === 'oldest'}
    onClick={() => setSortOrder('oldest')}
  >
    Oldest
  </SortPillButton>
    <ActionButton
    onClick={() => expiredRef.current?.scrollIntoView({ behavior: 'smooth' })}
  >
    Go to Expired
  </ActionButton>
</SortPillGroup>




      <Container>
{editingJob && (
  <ModalOverlay>
    <ModalContent>
      <h2>{editingJob.is_repost ? 'Preview & Repost Job' : 'Edit Job'}</h2>

      <div
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#111',
          borderRadius: '12px',
          maxWidth: '600px',
          margin: '0 auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <form onSubmit={editingJob.is_repost ? handleRepostSubmit : handleEditSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={editingJob.title}
              onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
            />
          </label>

          <label>
            Company:
            <input
              type="text"
              value={editingJob.company}
              onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
            />
          </label>

          <label>
            Location:
            <input
              type="text"
              value={editingJob.location}
              onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
            />
          </label>

          <label>
            Job Type:
            <select
              value={editingJob.jobType}
              onChange={(e) => setEditingJob({ ...editingJob, jobType: e.target.value })}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </label>

          <label>
            Salary:
            <input
              type="text"
              value={editingJob.salary}
              onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
            />
          </label>

          <label>
  Description:
  {editor && (
    <>
      <Toolbar>
       <ToolbarButton
  type="button"
  onClick={() => {
    if (editor.isActive('bold')) {
      editor.chain().focus().unsetBold().run();  // Turn bold OFF
    } else {
      editor.chain().focus().toggleBold().run(); // Turn bold ON
    }
  }}
  active={editor.isActive('bold')}
>
  Bold
</ToolbarButton>

        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolbarButton>
      </Toolbar>

      <EditorBox>
        <EditorContent editor={editor} />
      </EditorBox>
    </>
  )}
</label>


          <label>
            Apply Link:
            <input
              type="text"
              value={editingJob.applyLink}
              onChange={(e) => setEditingJob({ ...editingJob, applyLink: e.target.value })}
            />
          </label>

          {/* Logo Upload */}
         {editingJob.logoUploadedBefore && !editingJob.is_repost ? (
  <div>
    <img src={editingJob.logoUrl} alt="Logo" style={{ height: 40 }} />
    <p style={{ color: 'gray' }}>Logo already uploaded. Locked.</p>
  </div>
) : (
  <>
    <label>Upload Logo ($30)</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        setEditingJob({ ...editingJob, logoFile: e.target.files[0] });

        // Add 30 to amount only if is_repost is true and logo is added
        if (editingJob.is_repost) {
          setEditingJob((prev) => ({
            ...prev,
            extraAmount: (prev.extraAmount || 0) + 30
          }));
        }
      }}
    />
  </>
)}


          {/* Feature Job Option */}
        {(() => {
  const featuredUntil = editingJob?.featured_until
    ? new Date(editingJob.featured_until)
    : null;
  const now = new Date();
  const isCurrentlyFeatured = featuredUntil && featuredUntil > now;

  if (!isCurrentlyFeatured) {
    return (
      <div>
        <label>
          <input
            type="checkbox"
            checked={editingJob.featureJob}
            onChange={(e) =>
              setEditingJob((prev) => ({
                ...prev,
                featureJob: e.target.checked,
              }))
            }
            disabled={!editingJob.canFeatureNow}
          />
          Feature for 7 days ($39)
        </label>
        {!editingJob.canFeatureNow && (
          <p style={{ color: 'orange', fontSize: '0.85em', marginTop: '4px' }}>
            You can only feature a job if 7 or more days remain before it expires.
          </p>
        )}
      </div>
    );
  } else {
    return (
      <p style={{ color: 'green' }}>
        Already featured (until {featuredUntil.toDateString()})
      </p>
    );
  }
})()}

{editingJob?.is_repost && (
  <p>
    Total: <strong>${totalPrice}</strong>
  </p>
)}



          <ModalButtons>
    <ActionButton type="submit">
  {editingJob?.is_repost ? `Confirm & Pay $${totalPrice}` : 'Save'}
</ActionButton>


            <ActionButton
              type="button"
              color="#555"
              hoverColor="#777"
              onClick={() => setEditingJob(null)}
            >
              Cancel
            </ActionButton>
          </ModalButtons>
        </form>
      </div>
    </ModalContent>
  </ModalOverlay>
)}


        {jobs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#aaa', fontSize: '16px' }}>
            No jobs found.
          </p>
        ) : (
          jobs.map((job) => (
            <JobRow key={job.uuid}>
              <Left>
            <Logo
  src={job.logo_url || '/default-logo.png'}  // ✅ use DB field
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/default-logo.png';
  }}
/>

                <Info>
                  <Company>{job.company}</Company>
                  <Title>{job.title}</Title>
                  <Meta>
                    <span>💼 {job.job_type || 'Full-Time'}</span>
                    {job.location && <span>📍 {job.location}</span>}
                    {job.salary && <span>💰 {job.salary}</span>}
                  </Meta>
                </Info>
              </Left>
              <Right>
                <Time>{job.time && formatDistanceToNow(parseISO(job.time), { addSuffix: true })}</Time>
                <ActionButton color="#009624" hoverColor=" #00c853" onClick={() => handleEdit(job)}>
                  Edit
                </ActionButton>
                <ActionButton color="#d32f2f" hoverColor="#9a0000" onClick={() => handleDelete(job)}>
                  Delete
                </ActionButton>
              </Right>
            </JobRow>
          ))
        )}
      </Container>
      
         {expiredJobs.length > 0 && (
  <div ref={expiredRef}>
    <Heading>Expired Jobs</Heading>
    <Container>
      {expiredJobs.map((job) => (
        <JobRow key={job.uuid}>
          <Left>
            <Logo
              src={job.logo_url || '/default-logo.png'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-logo.png';
              }}
            />
            <Info>
              <Company>{job.company}</Company>
              <Title>{job.title}</Title>
              <Meta>
                <span>💼 {job.job_type}</span>
                {job.location && <span>📍 {job.location}</span>}
                {job.salary && <span>💰 {job.salary}</span>}
              </Meta>
            </Info>
          </Left>
          <Right>
    {!job.feature_job && (
  <ActionButton
    color="#ff9800"
    hoverColor="#fb8c00"
    onClick={() => handleRepostClick(job)} // ✅ Fix: open preview modal
  >
    Preview & Repost 
  </ActionButton>
)}


          </Right>
        </JobRow>
      ))}
    </Container>
  </div>
)}

    </PageWrapper>
  );
};

export default DashboardPage;

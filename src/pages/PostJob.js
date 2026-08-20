import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { supabase } from '../supabaseClient';
import { ArrowUpRight } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';



// Global styles
const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: #121212;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: #333;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DialogBox = styled.div`
  // background: rgba(0, 0, 0, 0);
  color: #eee;
  padding: 2rem 3rem;
  
  // border-radius: 8px;
  // box-shadow: 0 4px 12px rgba(0, 255, 128, 0.2);
  max-width: 400px;
  text-align: center;
  font-size: 1.2rem;
`;

const LoginButton = styled.button`
  margin-top: 0.4rem;
  background: #009624;
  border: none;
  border-radius: 25px;
  color: white;
  padding: 0.4rem 1.2rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #007a1f;
  }
`;
const greenPillStyle = {
  background:' #009624',
  color: 'white',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '50px',       // pill shape
  cursor: 'pointer',
  fontSize: '16px',
  marginLeft:'1rem'
};
const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #aaa;
`;

const EditorWrapper = styled.div`
margin-bottom:1.5rem;
  .ProseMirror {
    outline: none;
    min-height: 150px;
    max-height: 150px;
    overflow-y: auto;

    padding: 0.75rem 1rem;
    margin: 0;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #1c1c1c;
    color: #eee;

    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;

    p, ul, li {
      margin: 0;
      padding: 0;
      text-align: left;
    }

    ul {
      list-style-position: inside;
      padding-left: 1rem;
    }
  }
    .ProseMirror ul {
  list-style-position: outside; /* Move bullets outside */
  padding-left: 1.25rem;        /* Add space so bullet is outside */
}

.ProseMirror li {
  display: list-item;
  margin-left: 0;               /* Ensure no extra indent */
  text-indent: 0;               /* Prevent text from jumping */
  line-height: 1.5;
}
  .ProseMirror ol {
  padding-left: 1.25rem; /* same as bullet list */
  list-style-position: outside; /* ensures space between number and text */
  margin-left: 0.5rem; /* adds a little spacing */
}

.ProseMirror ol > li {
  margin-bottom: 0.25rem;
  line-height: 1.5;
}


`;


const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const ToolbarButton = styled.button`
  background: ${(props) => (props.active ? '#009624' : '#333')};
  border: none;
  border-radius: 16px;
  color: ${(props) => (props.active ? 'white' : '#bbb')};
  padding: 6px 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  user-select: none;
  transition: background 0.2s;

  &:hover {
  background:' #009624',
    color: white;
  }
`;

// Styled components for layout and UI
const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 4rem auto;
  padding: 2rem;
  background: #121212;
  box-shadow: 0 4px 12px rgba(0, 255, 128, 0.2);
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #e0e0e0;
`;

// const Label = styled.label`
//   font-weight: 500;
//   margin-bottom: 0.5rem;
//   color: #aaa;
// `;

const Input = styled.input`
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  background: #1c1c1c;
  color: #eee;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  background: #1c1c1c;
  color: #eee;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  background: #1c1c1c;
  color: #eee;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1db954, #1ed760);
  color: white;
  padding: 0.60rem 0.8rem;     // same height, reduced width
  font-size: 0.875rem;        // smaller font
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  width: fit-content; /* 👈 ensures it shrinks to fit text only */

  &:hover {
    background: linear-gradient(135deg, #1ed760, #1db954);
        // transform: scale(1.05);

  }
`;


const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  background: #4caf50;
  color: white;
  padding: 0.7rem 2.5rem;
  border-radius: 50px;   /* pill shape */
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.5);
  transition: background 0.3s ease;
  display: inline-block;

  &:hover {
    background: #3b8e40;
  }
`;

const FileNamePill = styled.div`
  display: inline-block;
  margin-left: 12px;
  padding: 0.7rem 1.5rem;
  background: #1c1c1c;
  color: #333;
  border-radius: 50px;   /* pill shape */
  font-size: 0.9rem;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;
const FileInputWrapper = styled.label`
  display: flex;
  align-items: center;
  background:rgb(37, 34, 34);
  border-radius: 50px; /* pill shape */
  padding: 0.4rem 0.5rem;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  max-width: 100%;
  transition: background 0.3s ease;
  gap: 10px;

  &:hover {
    // background: #e2e2e2;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadText = styled.span`
  background-color: #009624;  

  color: white;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
`;

const FileName = styled.span`
  color: #333;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const FileInputLabel = styled.label`
  background-color: #1db954;
  color: white;
  padding: 0.75rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 1.5rem;
  text-align: center;
  transition: background 0.3s;

  &:hover {
    background-color: #169c44;
  }

  input {
    display: none;
  }
`;

const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

// const FileName = styled.span`
//   color: #ccc;
//   font-size: 0.95rem;
//   font-style: italic;
// `;

const PriceSection = styled.div`
  background-color: #1a1a1a;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PriceDetails = styled.p`
  color: #ccc;
`;

const PriceHighlight = styled.label`
  font-weight: 500;
  color: #ccc;
`;

const PriceToggleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;  /* Add this for space below the toggle */
  margin-top: 1.5rem;    /* Add this for space above the toggle */
`;


const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ToggleLabel = styled.span`
  color: #ccc;
  font-weight: 600;
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 50px;
  height: 26px;
  display: inline-block;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #009624;
  }

  &:focus + span {
    box-shadow: 0 0 1px #1db954;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #444;
  border-radius: 26px;
  transition: background-color 0.3s;

  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s;
  }
`;

const PlanDescription = styled.div`
  background-color: #222;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  color: #cce3d0;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

const PlanBadge = styled.div`
  background-color: #009624;
  color: white;
  padding: 0.3rem 0.9rem;
  border-radius: 29px;
  display: inline-block;
  font-weight: 650;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.2rem;
`;

const PlanDetails = styled.div`
  margin-top: 1rem;
  color: #bbb;
  font-size: 1rem;

  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 1rem;
    text-align: left;
    font-size: 1.1rem;
  }

  li {
    margin-bottom: 8px;
    font-weight: 500;
  }
`;

const PlanDescriptionText = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  margin: 0.8rem 0;
  line-height: 1.5;
`;

const PostJob = () => {
  const [session, setSession] = useState(null);
const [userId, setUserId] = useState(null);
const [hasPostedJob, setHasPostedJob] = useState(false);
// const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  async function checkUserJobStatus(id) {
    if (!id) {
      setHasPostedJob(false);
      return;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('uuid')
      .eq('user_id', id)  // Make sure your jobs table has a `user_id` column
      .limit(1);

    if (error) {
      console.error('Error fetching job status:', error);
      setHasPostedJob(false);
    } else {
      setHasPostedJob(data.length > 0);
    }
  }

  // Fetch session and user ID on load and on auth state change
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Session from getSession:", session);
      setSession(session);
      setUserId(session?.user?.id ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Session from onAuthStateChange:", session);
      setSession(session);
      setUserId(session?.user?.id ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  // Trigger job check whenever userId is set
  useEffect(() => {
    if (userId) {
      checkUserJobStatus(userId);
    }
  }, [userId]);


const handleLogin = () => {
  window.location.href = '/login';  // redirect to login page
};

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    salary: '',
    description: '',
    applyLink: '',
    logoUrl: '',
    featureJob: false,
  });
const addLink = () => {
  if (!editor) return;

  const previousUrl = editor.getAttributes('link').href || '';
  const url = window.prompt('Enter a URL', previousUrl);

  if (url === null) return; // User canceled

  if (url === '') {
    editor.chain().focus().unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};



 const handleFileChange = async (event) => {
  const files = event.target.files;

  if (!files || files.length === 0) {
    // User cancelled file selection - clear previous logo name & preview
    setForm((prev) => ({
      ...prev,
      logoUrl: '',
      logoName: '',
    }));
    event.target.value = null; // Reset input value to allow future changes
    return;
  }

  const file = files[0];

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { data, error } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data: urlData, error: urlError } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    setForm((prev) => ({
      ...prev,
      logoUrl: urlData.publicUrl,
      logoName: file.name,
    }));

    event.target.value = null; // Reset for next selection
  } catch (error) {
    console.error('Error uploading logo:', error.message);
    alert('Logo upload failed. Please try again.');
    setForm((prev) => ({
      ...prev,
      logoUrl: '',
      logoName: '',
    }));
    event.target.value = null;
  }
};
  const fileInputRef = useRef(null);

const clearLogo = () => {
  setForm((prev) => ({
    ...prev,
    logoUrl: '',
    logoName: '',
  }));

  if (fileInputRef.current) {
    fileInputRef.current.value = null; // This clears the file input value
  }
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculateTotal = () => {
    let total = 99;
    if (form.featureJob) total += 39;
    if (form.logoUrl?.trim()) total += 30;
    return total;
  };
const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: true,
    }),
  ],
  content: '<p><a href="https://example.com"></a></p>',
});
const descriptionHtml = editor?.getHTML() || '';

const handleSubmit = async (e) => {
  e.preventDefault();
  const totalPrice = calculateTotal();
  const now = new Date();
const nowISO = now.toISOString();
const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
const featuredUntil = form.featureJob
  ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  : null;


  // Prepare the data object to insert
  const dataToInsert = {
    title: form.title,
    company: form.company,
    location: form.location,
    job_type: form.jobType,
    salary: form.salary,
  description: editor?.getHTML() || '', // <-- get description from editor
    apply_link: form.applyLink,
    feature_job: form.featureJob,
      expires_at: expiresAt, // ← Add this line
time: nowISO, // ✅ store in string format
    ...(form.featureJob && { featured_until: featuredUntil }),
      user_id: session?.user?.id, // ✅ <-- Add this line

  };

  // Add logo_url only if form.logoUrl is not empty or undefined
  if (form.logoUrl && form.logoUrl.trim() !== '') {
    dataToInsert.logo_url = form.logoUrl;
  }

  const { error } = await supabase.from('jobs').insert([dataToInsert]);

  if (error) {
    console.error('Error posting job:', error);
    alert('Failed to post job. Please try again!');
  } else {
    alert(`Job posted successfully! Total price: $${totalPrice}`);
    setForm({
      title: '',
      company: '',
      location: '',
      jobType: 'Full-time',
      salary: '',
      description: '',
      applyLink: '',
      logoUrl: '',       // Reset logoUrl here too
      featureJob: false,
    });
    window.scrollTo(0, 0);
  }
};


  const totalPrice = calculateTotal();

  return (
    <>
      <GlobalStyle />
     
      
    
      <PageWrapper>
        <FormSection onSubmit={handleSubmit}>
          <Title>Post a New Job</Title>

          <Label htmlFor="title">Job Title</Label>
          <Input name="title" value={form.title} onChange={handleChange} required />

          <Label htmlFor="company">Company Name</Label>
          <Input name="company" value={form.company} onChange={handleChange} required />

          <Label htmlFor="location">Location</Label>
          <Input name="location" value={form.location} onChange={handleChange} required />

          <Label htmlFor="jobType">Job Type</Label>
          <Select name="jobType" value={form.jobType} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </Select>

          <Label htmlFor="salary">Salary Range</Label>
          <Input name="salary" value={form.salary} onChange={handleChange} />

          {/* <Label htmlFor="description">Job Description</Label>
          <Textarea name="description" value={form.description} onChange={handleChange} required /> */}
          
<Label htmlFor="description">Job Description</Label>

<Toolbar>
  {/* Text Styles */}
  <ToolbarButton
    type="button"
    onClick={() => editor.chain().focus().toggleBold().run()}
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

  {/* Headings */}
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

  <ToolbarButton
    type="button"
    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
    active={editor.isActive('heading', { level: 4 })}
  >
    H4
  </ToolbarButton>

  {/* Lists */}
  <ToolbarButton
    type="button"
    onClick={() => editor.chain().focus().toggleBulletList().run()}
    active={editor.isActive('bulletList')}
  >
    • Bullet List
  </ToolbarButton>

  <ToolbarButton
    type="button"
    onClick={() => editor.chain().focus().toggleOrderedList().run()}
    active={editor.isActive('orderedList')}
  >
    1. Ordered List
  </ToolbarButton>

  {/* Link */}
 <ToolbarButton
  onClick={addLink}
  active={editor && editor.isActive('link')}
>
  Link
</ToolbarButton>

</Toolbar>


<EditorWrapper>
  <EditorContent editor={editor} />
</EditorWrapper>

          <Label htmlFor="applyLink">
            Apply Link <ArrowUpRight size={16} />
          </Label>
          <Input name="applyLink" type="url" value={form.applyLink} onChange={handleChange} required />

<Label htmlFor="logoFile">Upload Company Logo (Optional +$30)</Label>
<FileInputWrapper htmlFor="logoFile">
  <UploadText>Browse</UploadText>
  <FileName>{form.logoUrl ? form.logoUrl.split('/').pop() : 'No file chosen'}</FileName>
  <HiddenInput
    id="logoFile"
    type="file"
    accept="image/*"
          ref={fileInputRef}

    onChange={handleFileChange}
  />
</FileInputWrapper>



          {form.logoUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <Label>Logo Preview:</Label>
              <img src={form.logoUrl} alt="Logo Preview" style={{ maxWidth: '150px', borderRadius: '8px', marginTop: '0.5rem' }} />
<button
      type="button"
      style={greenPillStyle}
      onClick={clearLogo}
    >
      Remove
    </button>

            </div>
          )}

          <PriceHighlight>
     <PriceToggleSection>
  <ToggleWrapper>
    <ToggleLabel>Feature job for 7 days? (+$39)</ToggleLabel>
    <ToggleSwitch>
      <ToggleInput
        type="checkbox"
        name="featureJob"
        checked={form.featureJob}
        onChange={handleChange}
      />
      <Slider />
    </ToggleSwitch>
  </ToggleWrapper>
</PriceToggleSection>

          </PriceHighlight>

          <Button type="submit">Continue to payment </Button>
        </FormSection>

        <PriceSection>
          <PriceDetails>Base Price: <strong>$99</strong></PriceDetails>

          <PlanDescription>
            <PlanBadge>Standard Plan</PlanBadge>
            <PlanDescriptionText>🌟 Launch your job post with a professional touch!</PlanDescriptionText>
            <PlanDetails>
              <ul>
                <li>✔ Full Job Posting</li>
                <li>✔ Reach top-tier talent</li>
                <li>✔ 30-day duration</li>
                <li>✔ Advanced filters</li>
              </ul>
            </PlanDetails>
          </PlanDescription>

          {form.featureJob && (
            <PlanDescription>
              <PlanBadge>Featured</PlanBadge>
              <PlanDescriptionText>🚀 Featured jobs appear on the homepage!</PlanDescriptionText>
              <PlanDetails>
                <ul>
                  <li>✔ Homepage spotlight for 7 days</li>
                  <li>✔ Increased exposure with top placement</li>
                  <li>✔ Ideal for urgent/high-priority roles</li>
                </ul>
              </PlanDetails>
            </PlanDescription>
          )}

          <PriceDetails>
            <strong>Total Price: ${totalPrice}</strong>
          </PriceDetails>
        </PriceSection>
      </PageWrapper>
          {!session && (
        <Overlay>
          <DialogBox>
            Please log in first to post a job.
            <LoginButton onClick={handleLogin}>Login</LoginButton>
          </DialogBox>
        </Overlay>
      )}
      {/* {session && hasPostedJob && (
  <button onClick={() => window.location.href = '/dashboard'}>
    Go to Dashboard
  </button> */}
{/* )} */}

    </>
  );
};

export default PostJob;

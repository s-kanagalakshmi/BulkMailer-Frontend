import { useState } from 'react';
import './App.css';
import axios from "axios";
import * as XLSX from "xlsx"; 

function App() {
  const [msg, setmsg] = useState("")
  const [subject,setsubject]=useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setemailList] = useState([])

  const composeMsg = (evt) => {
    setmsg(evt.target.value)
  }
const subjecthandle=(evt)=>{
  setsubject(evt.target.value)
}
  const sendMsg = (e) => {
    setstatus(true)
    axios.post("https://bulkmailer-backend-a03i.onrender.com/send", {
      msg: msg,
      emailList: emailList,
    })
      .then((data) => {
        if (data.data.success === true) {
          alert("✅ Email sent!")
          // Clear all fields after sending
          setmsg(" ");
          setemailList([]);
          setsubject(" ")
          setstatus(false);
        } else {
          alert("❌ Failed")
          setstatus(false);
        }
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        setstatus(false);
      });
  };

  const uploadfile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      console.log("Raw email list from Excel:", emaillist);

      const totalList = emaillist.map(item => item.A);
      console.log("Extracted emails:", totalList);
      setemailList(totalList);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <section className="container">
        <h1>BUZZ MAILER</h1>
        <p className="tagline">We can send bulk emails smart, fast, and exciting.</p>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input id="subject" type="text" value={subject} onChange={subjecthandle} placeholder="Enter email subject" />
        </div>

        <div className="form-group">
          <label htmlFor="message">Compose Email</label>
          <textarea onChange={composeMsg} value={msg} id="message" rows="6" placeholder="Type your message here..."></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="fileUpload">Attachments (Upload Files)</label>
          <input id="fileUpload" onChange={uploadfile} type="file" />
        </div>

        <div className="form-group">
          <p>Emails Detected in Upload: <strong>{emailList.length}</strong></p>
        </div>
        <button type="button" className="send-button" onClick={sendMsg} >{status ? "Sending" : "Send Mail"}</button>
      </section>
    </>
  );
}

export default App;

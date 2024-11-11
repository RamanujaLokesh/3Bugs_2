// NoticeBoard.js
import React, { useEffect, useState } from "react";

const NoticeBoard = ({ hostel }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, [hostel]);

  const fetchNotices = async () => {
    try {
      let response = await fetch(`/api/data/notice?hostel=${hostel}`);
      if (!response.ok) throw new Error("Failed to fetch notices");
      
      response = await response.json();
      setNotices(response); // Save fetched notices to the state
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (filename) => {
    const downloadUrl = `/api/notice/download/${filename}`;
    window.open(downloadUrl, "_blank"); // Opens the PDF in a new tab
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load notices: {error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Notice Board</h1>
      <div className="space-y-6">
        {notices.length > 0 ? (
          notices.map((notice) => {
            const noticeDate = new Date(notice.timestamp);
            const formattedDate = noticeDate.toLocaleDateString();
            const formattedTime = noticeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div
                key={notice.id}
                className="p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="text-gray-500 text-sm mb-2 sm:mb-0 sm:mr-4">
                    <p>{formattedDate}</p>
                    <p>{formattedTime}</p>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">{notice.title}</h2>
                </div>
                <button
                  onClick={() => notice.pdf_document && handleDownload(notice.pdf_document)}
                  className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-800 hover:underline text-sm font-semibold"
                >
                  {notice.pdf_document ? "Open PDF" : "No PDF Available"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600">No notices available.</p>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;

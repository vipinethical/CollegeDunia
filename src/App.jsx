import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import collegeData from "./CollegeData";
import "./index.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Reference to the container to detect scroll events
  const listRef = useRef();

  // Define columns for the table
  const columns = [
    {
      title: "CD Rating",
      dataIndex: "college_dunia_rating",
      key: "college_dunia_rating",
      sorter: (a, b) => a.college_dunia_rating - b.college_dunia_rating,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#e0f7e9", // Light green background
          fontWeight: "bold",
          fontSize: "14px",
        },
      }),
    },
    {
      title: "Colleges",
      dataIndex: "college_name",
      key: "college_name",
      sorter: (a, b) => a.college_name.localeCompare(b.college_name),
      sortDirections: ["ascend", "descend"],
      // Style header
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#e0f7e9", // Light green background
          fontWeight: "bold", // Bold font
          fontSize: "14px", // Font size
        },
      }),
    },

    {
      title: "Course Fees",
      dataIndex: "fees",
      key: "fees",
      sorter: (a, b) => a.fees - b.fees,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#e0f7e9", // Light green background
          fontWeight: "bold",
          fontSize: "14px",
        },
      }),
    },
    {
      title: "Placement",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#e0f7e9", // Light green background
          fontWeight: "bold",
          fontSize: "14px",
        },
      }),
    },
    {
      title: "User Reviews",
      dataIndex: "user_rating",
      key: "user_rating",
      render: (user_rating) => user_rating + "/10",
      sorter: (a, b) => a.user_rating - b.user_rating,
      sortDirections: ["ascend", "descend"],
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#e0f7e9", // Light green background
          fontWeight: "bold",
          fontSize: "14px",
        },
      }),
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      render: (featured) => (featured ? "Yes" : "No"),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#e0f7e9", // Light green background
          fontWeight: "bold",
          fontSize: "14px",
        },
      }),
    },
  ];

  // Function to load more data
  const loadMoreData = () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Filter data based on search term
    const filtered = collegeData.filter(
      (college) =>
        college.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Determine if there is more data to load
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    if (startIndex >= filtered.length) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    // Load the next set of data
    const nextData = filtered.slice(startIndex, endIndex);
    setData((prevData) => [...prevData, ...nextData]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  // Load initial data when the component mounts
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    loadMoreData();
  }, [searchTerm]);

  // Add event listener for scroll event
  useEffect(() => {
    const handleScroll = () => {
      const listElement = listRef.current;
      if (listElement) {
        const { scrollTop, clientHeight, scrollHeight } = listElement;
        if (scrollHeight - scrollTop <= clientHeight * 1.2) {
          // Load more data when close to the bottom
          loadMoreData();
        }
      }
    };

    const listElement = listRef.current;
    listElement.addEventListener("scroll", handleScroll);
    return () => {
      listElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="App"
      ref={listRef}
      style={{ height: "600px", overflowY: "auto", width: "100%" }}
    >
      <h1 style={{ color: "#2b7a78", fontSize: "24px", paddingBottom: "16px" }}>
        College List
      </h1>
      <Input
        prefix={<SearchOutlined style={{ color: "#2b7a78" }} />}
        placeholder="Search Colleges"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 16px",
          marginBottom: "16px",
          borderRadius: "8px",
          borderColor: "#2b7a78",
        }}
      />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="college_name"
        pagination={false}
        style={{ height: "100%" }}
      />
      {loading && <Spin style={{ marginTop: "16px" }} />}
      {!hasMore && !loading && (
        <div style={{ color: "#2b7a78", paddingTop: "16px" }}>No more data</div>
      )}
    </div>
  );
}

export default App;

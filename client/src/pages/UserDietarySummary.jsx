import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import axiosInstance from "../axiosInstance";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  
  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F",
    "#FFBB28", "#0088FE", "#FF6666", "#AA66CC", "#33CC99"
  ];
  
  const DiaterySummary = () => {
    const [users, setUsers] = useState([]);
    const [dietaryStats, setDietaryStats] = useState([]);
  
    useEffect(() => {
      axiosInstance
        .get("/user")
        .then((response) => {
          const userOnly = response.data.filter((u) => u.role === "user");
          setUsers(userOnly);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
  
      axiosInstance
        .get("/user/generate-dietary-summary-report")
        .then((response) => {
          const report = response.data.report;
          const statsArray = Object.entries(report).map(([key, value]) => ({
            name: key,
            value,
          }));
          setDietaryStats(statsArray);
        })
        .catch((error) => {
          console.error("Error fetching dietary summary:", error);
        });
    }, []);
  
    const handleDownloadPDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Dietary Summary Report", 14, 22);
  
      autoTable(doc, {
        startY: 30,
        head: [["Dietary Preference", "Count"]],
        body: dietaryStats.map((stat) => [stat.name, stat.value]),
      });
  
      doc.save("dietary_summary_report.pdf");
    };
  
    return (
      <Box m="20px">
        <Typography variant="h3" mb={2}>
          Dietary Preferences Summary
        </Typography>
  
        <Paper sx={{ mb: 4, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            User Dietary Preferences Table
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Dietary Preferences</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{(user.dietaryPreferences || []).join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
  
        <Box display="flex" gap={2} mb={3}>
          <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
            Download Report as PDF
          </Button>
        </Box>
  
        <Box display="flex" flexWrap="wrap" gap={4}>
          <Box flex={1} minWidth={300}>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Pie Chart
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dietaryStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dietaryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
  
          <Box flex={1} minWidth={300}>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Bar Chart
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dietaryStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default DiaterySummary;
  
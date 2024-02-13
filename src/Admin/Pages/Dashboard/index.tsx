import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GET_API_JWT, POST_API_JWT } from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import "./index.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export default function Dashboard() {
  const jwt = GET_JWT_TOKEN();
  const [data, setData] = useState<any>([]);
  const { Role, Student_ID } = useSelector((state: any) => state.userDetails);
  let DashboardData: any;
  const fetchData = async () => {
    if (Role === "admin") {
      DashboardData = await GET_API_JWT("/getDashboardInfo", jwt);
    } else {
      DashboardData = await POST_API_JWT(
        "/getStudentDashboardInfo",
        { Student_ID },
        jwt
      );
    }
    if (!DashboardData.status) {
      toast.error(DashboardData.message);
    } else {
      setData(DashboardData.data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="bg-white flex flex-col md:flex-row gap-8 p-4 md:p-8 dashboard">
      {Role === "admin" ? (
        <>
          {data?.sevenDayReport?.length > 0 ? (
            <>
              <div
                className="w-full md:w-1/2 pt-2"
                style={{ marginLeft: "-35px" }}
              >
                <LineChart width={340} height={300} data={data?.sevenDayReport}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Transactions"
                    stroke="#1a60ad"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </div>
            </>
          ) : (
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader>
                  <Heading size="md">Chart</Heading>
                </CardHeader>
                <CardBody>
                  <Text>No data found to display the chart here</Text>
                </CardBody>
              </Card>
            </div>
          )}
          <div className="w-full md:w-1/4">
            <Card
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                zIndex: "1",
                backgroundColor: "blue.400",
                textColor: "white",
              }}
            >
              <CardHeader>
                <Heading size="md">Total Students</Heading>
              </CardHeader>
              <CardBody>
                <Text>{data?.totalStudents} Students</Text>
              </CardBody>
            </Card>
          </div>
          <div className="w-full md:w-1/4">
            <Card
              _hover={{
                backgroundColor: "blue.400",
                textColor: "white",
              }}
            >
              <CardHeader>
                <Heading size="md">Total Books</Heading>
              </CardHeader>
              <CardBody>
                <Text>{data?.totalBooks} Books</Text>
              </CardBody>
            </Card>
          </div>
          <div className="w-full md:w-1/4">
            <Card
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                zIndex: "1",
                backgroundColor: "blue.400",
                textColor: "white",
              }}
            >
              <CardHeader>
                <Heading size="md">Total Book Issued</Heading>
              </CardHeader>
              <CardBody>
                <Text>{data?.totalBooksIssued} Book Issued</Text>
              </CardBody>
            </Card>
          </div>
        </>
      ) : (
        <>
          {data?.sevenDayReport?.length > 0 ? (
            <>
              <div
                className="w-full md:w-1/2 pt-2"
                style={{ marginLeft: "-35px" }}
              >
                <LineChart width={340} height={300} data={data?.sevenDayReport}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Transactions"
                    stroke="#1a60ad"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </div>
            </>
          ) : (
            <div className="w-full md:w-1/4">
              <Card>
                <CardHeader>
                  <Heading size="md">Chart</Heading>
                </CardHeader>
                <CardBody>
                  <Text>No data found to display the chart here</Text>
                </CardBody>
              </Card>
            </div>
          )}

          <div className="w-full md:w-1/4">
            <Card
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                zIndex: "1",
                backgroundColor: "blue.400",
                textColor: "white",
              }}
            >
              <CardHeader>
                <Heading size="sm">Total Pending Transactions</Heading>
              </CardHeader>
              <CardBody>
                <Text>{data?.totalPendingTransactions} Books</Text>
              </CardBody>
            </Card>
          </div>
          <div className="w-full md:w-1/4">
            <Card
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                zIndex: "1",
                backgroundColor: "blue.400",
                textColor: "white",
              }}
            >
              <CardHeader>
                <Heading size="sm">Total Books Returned</Heading>
              </CardHeader>
              <CardBody>
                <Text>{data?.totalBooksReturned} Books</Text>
              </CardBody>
            </Card>
          </div>
          <div className="w-full md:w-1/4">
            <Card
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "lg",
                zIndex: "1",
                backgroundColor: "blue.400",
                textColor: "white",
              }}
            >
              <CardHeader>
                <Heading size="sm">Total Book Issued</Heading>
              </CardHeader>
              <CardBody>
                <Text>{data?.totalBooksIssued} Book Issued</Text>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

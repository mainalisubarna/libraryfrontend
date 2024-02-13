import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material";
import { POST_API_JWT } from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export type Book_Transaction = {
  Id: number;
  Status: string;
  Due_Date: string;
  Fine_Amt: number;
  returnedAt: string;
  Book: any;
  Student: any;
  Book_Id: number;
  Student_Id: number;
  NepaliDate: string;
};

const StudentTransactionView = () => {
  const jwt = GET_JWT_TOKEN();
  const [tableData, setTableData] = useState<Book_Transaction[]>([]);
  const [isLoading, setisLoading] = useState(false);

  let data: any;
  const { Student_ID } = useSelector((state: any) => state.userDetails);
  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await POST_API_JWT(
        "books/transactions/view",
        { Student_Id: Student_ID },
        jwt
      );
      data = response.data;
      if (!response.status) {
        toast.error(response.message);
      }
      setTableData(data);
      setisLoading(false);
    } catch (error: any) {
      console.log("Error fetching data" + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Book_Transaction>[]>(
    () => [
      {
        accessorKey: "Id",
        header: "ID",
        enableColumnOrdering: false,
        enableSorting: false,
        size: 4,
      },
      {
        accessorKey: "NepaliDate",
        header: "Date",
        size: 20,
      },
      {
        accessorKey: "Book.Book_Name",
        header: "Book",
        size: 60,
      },
      {
        accessorKey: "Due_Date",
        header: "Due Date",
        size: 20,
      },
      {
        accessorFn: (row) => {
          if (row.Status === "Issued") {
            return (
              <span className="inline-block bg-blue-500 text-white font-bold py-1 px-3 rounded">
                {row.Status}
              </span>
            );
          } else if (row.Status === "Returned") {
            return (
              <span className="inline-block bg-green-500 text-white font-bold py-1 px-3 rounded">
                {row.Status}
              </span>
            );
          } else if (row.Status === "Pending") {
            return (
              <span className="inline-block bg-yellow-500 text-white font-bold py-1 px-3 rounded">
                {row.Status}
              </span>
            );
          }
        },
        size: 20,
        accessorKey: "Status",
        header: "Status",
      },
      {
        accessorFn: (row) =>
          row.Fine_Amt !== 0 ? (
            <p className="text-sm text-red-700 font-bold">
              {"Rs " + row.Fine_Amt}
            </p>
          ) : (
            <p className="text-xs text-green-900 font-bold">NO PENALTY</p>
          ),
        accessorKey: "Fine_Amt",
        header: "Fine Amt",
        size: 40,
      },
      {
        accessorFn: (row) =>
          row.returnedAt == null ? (
            <p className="text-xs text-gray-600 font-bold">Not Returned Yet</p>
          ) : (
            <p className="text-sm font-bold">{row.returnedAt}</p>
          ),
        accessorKey: "returnedAt",
        header: "Returned Date",
        size: 80,
      },
    ],
    []
  );

  return (
    <>
      <ThemeProvider theme={createTheme()}>
        <MaterialReactTable
          state={{ isLoading }}
          columns={columns}
          data={tableData ?? []}
          enableColumnOrdering
        />
      </ThemeProvider>
    </>
  );
};

export default StudentTransactionView;

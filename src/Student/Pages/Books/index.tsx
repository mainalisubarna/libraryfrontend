import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  IconButton,
  ThemeProvider,
  Tooltip,
  createTheme,
  Button,
  Modal,
} from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { GET_API_JWT, POST_API_JWT } from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";
import { Center } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import nepaliDateConverter from "nepali-date-converter";

export type Book = {
  Book_Id: number;
  Book_Name: string;
  Author_Name: string;
  Publication: string;
  Published_Date: string;
  Quantity_Remaining: number;
};

const StudentBookView = () => {
  const jwt = GET_JWT_TOKEN();
  const dateNp = new nepaliDateConverter(new Date()).getDateObject().BS;
  const nepaliDateNow =
    dateNp.year + "-" + (dateNp.month + 1) + "-" + dateNp.date;
  const [date, setDate] = useState<any>(nepaliDateNow);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<Book[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [err, setErr] = useState("");
  const handleDate = (date: any) => {
    setDate(date);
  };

  let data: any;
  const { Student_ID } = useSelector((state: any) => state.userDetails);
  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await GET_API_JWT("books/", jwt);
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

  const handleBorrowRequest = async (row: any) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleBorrowBookRequest = async () => {
    setOpen(false);
    if (!selectedRow) return;
    if (date !== null && date && date !== "") {
      const Book_Id = selectedRow.getValue("Book_Id");
      const response = await POST_API_JWT(
        "books/transactions/request",
        { Book_Id, Student_Id: Student_ID, Due_Date: date },
        jwt
      );
      if (response.status) {
        console.log(response);
        toast.success(response.message);
        fetchData();
      } else {
        console.log(response);
        toast.error(response.message);
      }
    } else {
      setErr("Make a valid input");
    }
  };

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: "Book_Id",
        header: "ID",
        enableColumnOrdering: false,
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "Book_Name",
        header: "Book",
        size: 140,
      },
      {
        accessorKey: "Author_Name",
        header: "Author",
        size: 80,
      },
      {
        accessorKey: "Publication",
        header: "Publication",
      },
      {
        accessorKey: "Published_Date",
        header: "Published Year",
        size: 80,
      },
      {
        accessorKey: "Quantity_Remaining",
        header: "Remaining Quantity",
        size: 80,
      },
    ],
    []
  );

  return (
    <>
      <ThemeProvider theme={createTheme()}>
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              size: 120,
            },
          }}
          state={{ isLoading }}
          columns={columns}
          data={tableData ?? []}
          enableColumnOrdering
          enableEditing
          renderRowActions={({ row }) => (
            <Center>
              <Tooltip arrow placement="top" title="Borrow the book">
                <IconButton
                  color="primary"
                  onClick={() => handleBorrowRequest(row)}
                >
                  <FiPlus />
                </IconButton>
              </Tooltip>
            </Center>
          )}
        />
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 className=" text-2xl font-extrabold leading-none tracking-tight text-gray-900 my-4">
              Borrow Book
            </h2>
            <label htmlFor="Date">Due Date : </label>
            <NepaliDatePicker
              value={date}
              options={{ calenderLocale: "ne", valueLocale: "en" }}
              inputClassName="w-full px-3 my-1 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              onChange={handleDate}
            />
            <p className="text-sm text-red-700">{err ? err : null}</p>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleBorrowBookRequest}
              >
                Borrow
              </Button>
            </Box>
          </Box>
        </Modal>
      </ThemeProvider>
    </>
  );
};

export default StudentBookView;

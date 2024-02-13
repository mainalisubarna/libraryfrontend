import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ThemeProvider,
  Tooltip,
  createTheme,
  Button,
  DialogContentText,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  DELETE_API_JWT,
  GET_API_JWT,
  POST_API_JWT,
} from "../../../Service/Axios/Api.service";

import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";
import "nepali-datepicker-reactjs/dist/index.css";
import EditModal from "./EditModal";
import AddModal from "./AddModal";

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

const Book_Transaction = () => {
  const jwt = GET_JWT_TOKEN();
  const [Students, setStudents]: any = useState([]);
  const [Books, setBooks]: any = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editRow, setEditRow] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<Book_Transaction[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  let data: any;
  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await GET_API_JWT("books/transactions/", jwt);
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
  const getStudents = async () => {
    try {
      const response = await GET_API_JWT("students/", jwt);
      data = response.data;
      let NewData: any;
      if (data) {
        NewData = data.map((student: any) => {
          return {
            id: student.Student_Id,
            label:
              student.First_Name +
              " " +
              student.Last_Name +
              " - " +
              student.Academics,
          };
        });
      }
      if (!response.status) {
        toast.error(response.message);
      }
      setStudents(NewData);
    } catch (error: any) {
      console.log("Error fetching data" + error.message);
    }
  };

  const getBooks = async () => {
    try {
      const response = await GET_API_JWT("books/", jwt);
      data = response.data;
      let NewData: any;
      if (data) {
        NewData = data
          .map((book: any) => {
            if (book.Quantity_Remaining > 0) {
              return {
                id: book.Book_Id,
                label:
                  book.Book_Name +
                  "-" +
                  book.Publication +
                  "-Remaining Qty = " +
                  book.Quantity_Remaining,
              };
            } else {
              return null;
            }
          })
          .filter((book: any) => book !== null);
      }
      if (!response.status) {
        toast.error(response.message);
      }
      setBooks(NewData);
    } catch (error: any) {
      console.log("Error fetching data" + error.message);
    }
  };
  useEffect(() => {
    fetchData();
    getStudents();
    getBooks();
  }, []);

  const handleCreateNewRow = async (values: Book_Transaction) => {
    const response = await POST_API_JWT(
      "books/transactions/issue",
      values,
      jwt
    );
    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchData();
    getStudents();
    getBooks();
  };
  const handleOpenEditModal = (row: any) => {
    setEditRow(row);
    setOpenEditModal(true);
  };

  const handleDeleteRow = async (row: any) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleConfirmDelete = async () => {
    setOpen(false);
    if (!selectedRow) return;

    const Id = selectedRow.getValue("Id");

    const response = await DELETE_API_JWT(
      `books/transactions/delete/${Id}`,
      jwt
    );

    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchData();
    getStudents();
    getBooks();
  };

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
        accessorFn: (row) =>
          `${row.Student.First_Name} ${row.Student.Last_Name}`,
        id: "name",
        header: "Student",
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
        <EditModal
          fetchData={fetchData}
          rows={editRow}
          openEditModal={openEditModal}
          handleCloseEditModal={handleCloseEditModal}
        />
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              size: 40,
            },
          }}
          state={{ isLoading }}
          columns={columns}
          data={tableData ?? []}
          enableEditing
          enableColumnOrdering
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "2px" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => handleOpenEditModal(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              color="primary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Issue Book
            </Button>
          )}
        />
        <AddModal
          Students={Students}
          Books={Books}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the transaction of the{" "}
              {selectedRow?.getValue("Book.Book_Name")} book borrowed by{" "}
              {selectedRow?.getValue("name")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default Book_Transaction;

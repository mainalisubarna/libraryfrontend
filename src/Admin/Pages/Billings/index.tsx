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
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
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
import { FiPlus, FiPrinter } from "react-icons/fi";
import ReceiptModal from "./receiptModal";

export type Fine_Billing = {
  Id: number;
  NepaliDate: string;
  Amount_Recieved: number;
  TransactionId: number;
  createdAt: string;
  UpdatedAt: any;
  BookTransaction: any;
};

const Fine_Transaction = () => {
  const jwt = GET_JWT_TOKEN();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [editRow, setEditRow] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [printData, setPrintData] = useState<any>([]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setPrintData([]);
  };
  let data: any;
  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await GET_API_JWT("billings/fine/", jwt);
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

  const getTransactions = async () => {
    try {
      const response = await GET_API_JWT("books/transactions/", jwt);
      data = response.data;
      let NewData: any;
      if (data) {
        NewData = data
          .map((transaction: any) => {
            if (
              transaction.Status === "Returned" &&
              transaction.FineTransaction.length === 0 &&
              transaction.Fine_Amt > 0
            ) {
              return {
                id: transaction.Id,
                label:
                  transaction.Book.Book_Name +
                  " Borrowed by " +
                  transaction.Student.First_Name +
                  " " +
                  transaction.Student.Last_Name +
                  " on " +
                  transaction.NepaliDate +
                  " Fine - Rs " +
                  transaction.Fine_Amt,
              };
            } else {
              return null;
            }
          })
          .filter((transaction: any) => transaction !== null);
      }
      if (!response.status) {
        toast.error(response.message);
      }
      setTransactions(NewData);
    } catch (error: any) {
      console.log("Error fetching data" + error.message);
    }
  };
  useEffect(() => {
    fetchData();
    getTransactions();
  }, []);

  const handleCreateNewRow = async (values: Fine_Billing) => {
    const response = await POST_API_JWT("billings/fine/add", values, jwt);
    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchData();
    getTransactions();
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
    fetchData();
    getTransactions();
  };

  const handlePrintReceipt = (row: any) => {
    setModalOpen(true);
    setPrintData(row.original);
  };
  const handleConfirmDelete = async () => {
    setOpen(false);
    if (!selectedRow) return;

    const Id = selectedRow.getValue("Id");

    const response = await DELETE_API_JWT(`billings/fine/delete/${Id}`, jwt);

    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchData();
    getTransactions();
  };

  const columns = useMemo<MRT_ColumnDef<Fine_Billing>[]>(
    () => [
      {
        accessorKey: "Id",
        header: "ID",
        enableColumnOrdering: false,
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "NepaliDate",
        header: "Date",
        size: 40,
      },
      {
        accessorFn: (row) => {
          return (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {row.BookTransaction.Book.Book_Name +
                " Book Borrowed By " +
                row.BookTransaction.Student.First_Name +
                " " +
                row.BookTransaction.Student.Last_Name +
                " on " +
                row.BookTransaction.NepaliDate}
            </Typography>
          );
        },
        id: "details",
        header: "Transaction Details",
      },

      {
        accessorFn: (row) => (
          <p className="text-sm text-red-700 font-bold">
            {"Rs " + row.BookTransaction.Fine_Amt}
          </p>
        ),
        header: "Fine Amt",
        size: 30,
      },
      {
        accessorFn: (row) => (
          <p className="text-sm text-green-700 font-bold">
            {"Rs " + row.Amount_Recieved}
          </p>
        ),
        accessorKey: "Amount_Recieved",
        header: "Amt Recieved",
        size: 30,
      },
      {
        accessorFn: (row: any) => {
          if (row.BookTransaction.Fine_Amt - row.Amount_Recieved > 0) {
            return (
              <span className="inline-block bg-blue-500 text-white font-bold py-1 px-3 rounded">
                Partially Paid
              </span>
            );
          } else {
            return (
              <span className="inline-block bg-green-500 text-white font-bold py-1 px-3 rounded">
                Paid
              </span>
            );
          }
        },
        id: "Status",
        header: "Status",
        size: 30,
      },
      {
        accessorFn: (row: any) => {
          if (row.BookTransaction.Fine_Amt - row.Amount_Recieved !== 0) {
            return (
              <p className="text-sm text-red-700 font-bold">
                {"Rs " + (row.BookTransaction.Fine_Amt - row.Amount_Recieved)}
              </p>
            );
          } else {
            return <p className="text-sm text-green-700 font-bold">Null</p>;
          }
        },
        header: "Balance",
        size: 30,
      },
    ],
    []
  );

  return (
    <>
      <ThemeProvider theme={createTheme()}>
        <ReceiptModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          printData={printData}
        />
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
              size: 50,
            },
          }}
          state={{ isLoading }}
          columns={columns}
          data={tableData ?? []}
          enableColumnOrdering
          enableEditing
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "1px" }}>
              <Tooltip arrow placement="left" title="Print the receipt">
                <IconButton onClick={() => handlePrintReceipt(row)}>
                  <FiPrinter />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="top" title="Add Amount Recieved">
                <IconButton onClick={() => handleOpenEditModal(row)}>
                  <FiPlus />
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
              Add Cash Receipt
            </Button>
          )}
        />
        <AddModal
          open={createModalOpen}
          data={transactions}
          onClose={() => {
            setCreateModalOpen(false);
          }}
          onSubmit={handleCreateNewRow}
        />
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"Are you sure you want to delete the billing of the " +
                selectedRow?.original.BookTransaction.Book.Book_Name +
                " book borrowed by " +
                selectedRow?.original.BookTransaction.Student.First_Name +
                " " +
                selectedRow?.original.BookTransaction.Student.Last_Name +
                " on " +
                selectedRow?.original.BookTransaction.NepaliDate}
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

export default Fine_Transaction;

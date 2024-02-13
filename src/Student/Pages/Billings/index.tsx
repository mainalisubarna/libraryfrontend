import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  IconButton,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import { POST_API_JWT } from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FiPrinter } from "react-icons/fi";
import { Center } from "@chakra-ui/react";
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

const StudentBillingsView = () => {
  const jwt = GET_JWT_TOKEN();
  const [tableData, setTableData] = useState<Fine_Billing[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [printData, setPrintData] = useState<any>([]);

  let data: any;
  const { Student_ID } = useSelector((state: any) => state.userDetails);
  const fetchData = async () => {
    try {
      setisLoading(true);
      const response = await POST_API_JWT(
        "billings/fine/view",
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

  const handleCloseModal = () => {
    setModalOpen(false);
    setPrintData([]);
  };

  const handlePrintReceipt = (row: any) => {
    setModalOpen(true);
    setPrintData(row.original);
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
                " Book Borrowed on " +
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
        <MaterialReactTable
          state={{ isLoading }}
          columns={columns}
          data={tableData ?? []}
          enableColumnOrdering
          enableEditing
          renderRowActions={({ row }) => (
            <Center>
              <Tooltip arrow placement="left" title="Print the receipt">
                <IconButton onClick={() => handlePrintReceipt(row)}>
                  <FiPrinter />
                </IconButton>
              </Tooltip>
            </Center>
          )}
        />
      </ThemeProvider>
    </>
  );
};

export default StudentBillingsView;

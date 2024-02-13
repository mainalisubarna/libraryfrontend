import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
} from "material-react-table";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
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

export type Book = {
  Book_Id: number;
  Book_Name: string;
  Author_Name: string;
  Publication: string;
  Published_Date: string;
  Quantity: number;
};

const Books = () => {
  const jwt = GET_JWT_TOKEN();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<Book[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  let data: any;
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

  const handleCreateNewRow = async (values: Book) => {
    const response = await POST_API_JWT("books/add", values, jwt);
    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchData();
  };

  const handleSaveRowEdits: MaterialReactTableProps<Book>["onEditingRowSave"] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;
        let { Book_Id } = values;
        const response = await POST_API_JWT(
          `books/edit/${Book_Id}`,
          values,
          jwt
        );
        if (response.status) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        fetchData();
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  const handleDeleteRow = async (row: any) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleConfirmDelete = async () => {
    setOpen(false);
    if (!selectedRow) return;

    const Book_Id = selectedRow.getValue("Book_Id");

    const response = await DELETE_API_JWT(`books/delete/${Book_Id}`, jwt);

    if (response.status) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    fetchData();
  };

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Book>
    ): MRT_ColumnDef<Book>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `Valid ${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: "Book_Id",
        header: "ID",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "Book_Name",
        header: "Book",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "Author_Name",
        header: "Author",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "Publication",
        header: "Publication",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "Published_Date",
        header: "Published Year",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "Quantity",
        header: "Total Quantity",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
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
          editingMode="modal" //default
          enableColumnOrdering
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
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
              Add Book
            </Button>
          )}
        />
        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {"Are you sure Do you want to delete the details of " +
                selectedRow?.getValue("Book_Name") +
                " and its transactions"}
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

interface CreateModalProps {
  columns: MRT_ColumnDef<Book>[];
  onClose: () => void;
  onSubmit: (values: Book) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {} as any)
  );
  const [err, setErr]: any = useState(null);

  const handleSubmit = async () => {
    if (
      values.Book_Name !== "" &&
      values.Author_Name !== "" &&
      values.Publication !== "" &&
      values.Published_Date !== "" &&
      values.Quantity !== ""
    ) {
      onSubmit(values);
      onClose();
    } else {
      setErr("All field are mandatory to heads up.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Add Book</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "Book_Id") {
                return null;
              }
              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              );
            })}
          </Stack>
        </form>
        <p style={{ color: "red" }}>{err ? err : null}</p>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Add Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;

export default Books;

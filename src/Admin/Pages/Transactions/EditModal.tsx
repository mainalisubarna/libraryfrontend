import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { POST_API_JWT } from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";
import nepaliDateConverter from "nepali-date-converter";

const EditModal = ({
  rows,
  handleCloseEditModal,
  fetchData,
  openEditModal,
}: any) => {
  const [status, setStatus] = useState("Issued");
  useEffect(() => {
    if (rows?.original.Status === "Issued") {
      setStatus("Issued");
    } else if (rows?.original.Status === "Returned") {
      setStatus("Returned");
    } else if (rows?.original.Status === "Pending") {
      setStatus("Issued");
    }
    setDueDate(rows?.original.Due_Date);
  }, [openEditModal]);
  const dateNp = new nepaliDateConverter(new Date()).getDateObject().BS;
  const nepaliDateNow =
    dateNp.year + "-" + (dateNp.month + 1) + "-" + dateNp.date;
  const [date, setDate] = useState(nepaliDateNow);
  const [dueDate, setDueDate] = useState("");
  const jwt = GET_JWT_TOKEN();
  const handleDate = (date: any) => {
    setDate(date);
  };

  const handleSaveEditModal = async () => {
    const id = rows?.original.Id;
    let values: any;
    if (status === "Issued") {
      values = {
        Status: status,
        returnedAt: null,
        dueDate,
      };
    } else if (status === "Returned") {
      values = {
        Status: status,
        returnedAt: date,
      };
    } else {
      values = {
        Status: status,
      };
    }
    const response = await POST_API_JWT(
      `books/transactions/edit/${id}`,
      values,
      jwt
    );
    if (response.status) {
      toast.success(response.message);
      fetchData();
    } else {
      toast.error(response.message);
    }
    setStatus("");
    handleCloseEditModal();
  };

  return (
    <>
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
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
          <h2 className=" text-2xl font-extrabold leading-none tracking-tight text-gray-900  my-2">
            Edit the Book Transaction
          </h2>
          {rows?.original.Status === "Issued" ? (
            <p className="my-2">Fine Amount : Rs {rows?.original.Fine_Amt}</p>
          ) : (
            <br />
          )}
          {status !== "Returned" ? (
            <>
              <label htmlFor="Returned Date">Due Date</label>
              <NepaliDatePicker
                value={dueDate}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
                inputClassName="w-full px-3 my-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={(date: any) => {
                  setDueDate(date);
                }}
              />
            </>
          ) : null}

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            {rows?.original.Status === "Pending" ? (
              <>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Status"
                  onChange={(e: any) => {
                    setStatus(e.target.value);
                  }}
                >
                  <MenuItem value={"Issued"}>Issued</MenuItem>
                  <MenuItem value={"Rejected"}>Rejected</MenuItem>
                </Select>
              </>
            ) : (
              <>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="Status"
                  onChange={(e: any) => {
                    setStatus(e.target.value);
                  }}
                >
                  <MenuItem value={"Issued"}>Issued</MenuItem>
                  <MenuItem value={"Returned"} selected>
                    Returned
                  </MenuItem>
                </Select>
              </>
            )}
          </FormControl>
          {status === "Issued" ? null : (
            <>
              <label htmlFor="Returned Date">Returned Date</label>
              <NepaliDatePicker
                value={date}
                options={{ calenderLocale: "ne", valueLocale: "en" }}
                inputClassName="w-full px-3 my-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                onChange={handleDate}
              />
            </>
          )}
          {rows?.original.Status === "Issued" ? (
            <p className="text-xs">
              Click save only after collecting the fine amount as mentioned
              above and generate receipt from billing section.
            </p>
          ) : null}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleCloseEditModal}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSaveEditModal}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditModal;

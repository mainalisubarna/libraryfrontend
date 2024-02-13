import { Modal, Box, Button } from "@mui/material";

const ReceiptModal = ({ isOpen, onClose, printData }: any) => {
  return (
    <>
      {isOpen ? (
        <>
          <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#f9f9f9",
                boxShadow: 24,
                p: 6,
                minWidth: "80%",
                maxWidth: "90%",
                maxHeight: "80%",
                overflowY: "auto",
                borderRadius: "16px",
                outline: "none",
              }}
            >
              <h2
                id="modal-title"
                className="text-4xl font-bold mb-6 text-center"
              >
                Library Fine Receipt
              </h2>
              <div className="border-b border-gray-300 pb-4">
                <p className="font-semibold">Date: {printData.NepaliDate}</p>
                <p className="font-semibold">Receipt No: {printData.Id}</p>
                <p className="font-semibold">
                  Student:{" "}
                  {printData.BookTransaction.Student.First_Name +
                    " " +
                    printData.BookTransaction.Student.Last_Name +
                    " - " +
                    printData.BookTransaction.Student.Academics}
                </p>
                <p className="font-semibold">Payment Method: Cash</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <p>Returned Book:</p>
                  <p>Rs 0</p>
                </div>
                <div className="flex justify-between">
                  <p>Late Fine:</p>
                  <p>Rs {printData.BookTransaction.Fine_Amt}</p>
                </div>
                <div className="border-t border-gray-300 pt-4 flex justify-between">
                  <p className="font-semibold">Total Amount:</p>
                  <p className="font-semibold">
                    Rs {printData.BookTransaction.Fine_Amt}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Amount Received</p>
                  <p>Rs {printData.Amount_Recieved}</p>
                </div>
                <div className="border-t border-gray-300 pt-4 flex justify-between">
                  <p className="font-semibold">Balance:</p>
                  <p className="font-semibold">
                    Rs{" "}
                    {printData.BookTransaction.Fine_Amt -
                      printData.Amount_Recieved}
                  </p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="space-x-2">
                  <Button
                    variant="contained"
                    onClick={() => window.print()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded"
                  >
                    Print Receipt
                  </Button>
                  <Button
                    variant="contained"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded"
                  >
                    Close
                  </Button>
                </div>
              </div>
              <div className="py-3 text-center">
                <p>
                  © 2023 Aroma. Developed by{" "}
                  <a
                    href="https://www.facebook.com/Mainali.Ji.Chitwan"
                    className="text-blue-600"
                  >
                    {" "}
                    Subarna Mainali
                  </a>
                </p>
              </div>
            </Box>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default ReceiptModal;

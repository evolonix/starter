interface DetailsAlertProps {
  children: React.ReactNode;
}

export const DeleteAlert = ({ children }: DetailsAlertProps) => {
  return <div>{children}</div>;
};

export default DeleteAlert;

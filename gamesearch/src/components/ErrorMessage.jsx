export default function ErrorMessage({ message }) {
  return (
    <div className="w-full  flex flex-col justify-center items-center">
      <img src="./nothing found.png" className="size-52" />
      <p className="text-gray-300 text-2xl">{message}</p>
    </div>
  );
}
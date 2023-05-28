import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Todo App!</h1>
      <li className="menu-item">
        <Link href={"list"}>Go to Take Note</Link>
      </li>
    </div>
  );
}

"use client";

import { useState, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import LoadingDots from "@/components/loading-dots";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Form({ type }: { type: "login" | "register" }) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [formValues, setFormValues] = useState({
		name: "",
		email: "",
		password: "",
	});

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setLoading(true);
		setFormValues({ name: "", email: "", password: "" });

		if (type === "login") {
			signIn("credentials", {
				redirect: false,
				email: formValues.email,
				password: formValues.password,
				// @ts-ignore
			}).then(({ error }) => {
				if (error) {
					setLoading(false);
					toast.error(error);
				} else {
					router.refresh();
					router.push("/protected");
				}
			});
		} else {
		console.log(formValues);


			fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			}).then(async (res) => {
				setLoading(false);
				if (res.status === 200) {
					toast.success("Account created! Redirecting to login...");
					setTimeout(() => {
						router.push("/login");
					}, 2000);
				} else {
					const { error } = await res.json();
					toast.error(error);
				}
			});
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	};

	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
		>
			{type === "register" ? (
				<div>
					<label htmlFor="name" className="block text-xs text-gray-600 uppercase">
						Full Name
					</label>
					<input
						name="name"
						type="text"
						placeholder="John Smith"
						autoComplete="name"
						required
						onChange={handleChange}
						className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
					/>
				</div>
			) : null}
			<div>
				<label htmlFor="email" className="block text-xs text-gray-600 uppercase">
					Email Address
				</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="johnsmith@email.com"
					autoComplete="email"
					required
					onChange={handleChange}
					className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
				/>
			</div>
			<div>
				<label htmlFor="password" className="block text-xs text-gray-600 uppercase">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					onChange={handleChange}
					placeholder="********"
					className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
				/>
			</div>
			<button
				disabled={loading}
				className={`${
					loading
						? "cursor-not-allowed border-gray-200 bg-gray-100"
						: "border-black bg-black text-white hover:bg-white hover:text-black"
				} flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
			>
				{loading ? (
					<LoadingDots color="#808080" />
				) : (
					<p>{type === "login" ? "Sign In" : "Sign Up"}</p>
				)}
			</button>
			{type === "login" ? (
				<p className="text-center text-sm text-gray-600">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="font-semibold text-gray-800">
						Sign up
					</Link>{" "}
					for free.
				</p>
			) : (
				<p className="text-center text-sm text-gray-600">
					Already have an account?{" "}
					<Link href="/login" className="font-semibold text-gray-800">
						Sign in
					</Link>{" "}
					instead.
				</p>
			)}
		</form>
	);
}

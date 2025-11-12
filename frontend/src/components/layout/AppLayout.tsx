import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout: React.FC = () => {
	return (
		<div>
			<Navbar />
			<div className="pt-16 px-6">
				<Outlet />
			</div>
		</div>
	);
};

export default AppLayout;

import { Routes, Route } from 'react-router-dom';
import About from "./components/pages/about/About";
import Layout from "./components/pages/Layout";
import Scheduler from "./components/pages/scheduler/Scheduler";
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Scheduler />} />
                <Route path='/scheduler/:room' element={<Scheduler />} />
                <Route path='/scheduler' element={<Scheduler />} />
                <Route path='/about' element={<About />} />
            </Route>
 
        </Routes>
    );
}



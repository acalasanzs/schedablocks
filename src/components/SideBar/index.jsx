import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import {BiHomeCircle} from 'react-icons/bi'
import './style.css';
const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg">
                    
        <SideBarIcon icon={<Logo />} text="a Random logo 🤣" />
        <Divider />
        <SideBarIcon icon={<BsPlus size="32" />} text="New 💗" />
        <Divider />
        <SideBarIcon icon={<BsGearFill size="22" />} text="Settings" />
        <SideBarIcon icon={<BiHomeCircle size="22" />} text="Home" />
    </div>
  );
};
const SideBarIcon = ({ icon, text = 'tooltip 💡' }) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </div>
);
const Logo = () => (
  <svg className='logo' width={48} height={48} viewBox="5 -1 48 48">
    <path d='m 20.761759,16.55284 c -6.84995,-4.275511 -5.546453,-9.426231 -0.806044,-9.6277435 2.937476,-0.053559 4.993836,1.1262282 4.701933,1.8801452 -0.47429,1.2249803 -0.867498,4.7296003 -1.419076,2.2913783 -1.115241,-4.9298674 -7.068131,-2.4075624 -6.056933,-0.431927 3.009414,6.578389 7.113189,3.650124 7.639556,8.672359 0.461107,3.603107 -5.007283,5.307025 -8.000094,3.462628 -1.201675,-1.080428 -1.348032,-1.521651 -1.388186,-2.731593 0.05971,-0.388094 0.119414,-0.761263 0.179121,-1.119505 0.05971,-0.358241 0.119414,-0.664239 0.179121,-0.917994 0,0 0.663697,-0.920974 0.660731,-0.726949 -1.06889,9.131377 10.363025,2.675963 4.309871,-0.750797 z'/>
  </svg>
)


const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;

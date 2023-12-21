import React from 'react'
import { FaRegMessage } from "react-icons/fa6";

import './styles.scss'

const DashboardCard = ({name,numb}) => {
  return (
    <div className="dashboardCard">
    <div className="dashCardSymbol"><FaRegMessage/></div>
    <div className="dashCardRight">
        <div className="dashHead">{name}</div>
        <div className="dashNumb">{numb}</div>
    </div>
  </div>
  )
}

export default DashboardCard


// export default function dashBoardCard({name,numb})   {
//     return(
 
//     )
// }


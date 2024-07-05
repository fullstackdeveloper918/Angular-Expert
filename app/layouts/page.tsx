"use client"
// import TheSideBar from "../components/common/TheSideBar"
// import TheHeader from "../components/common/TheHeader"
// import { Outlet } from "react-router-dom";
// import TheFooter from "../components/common/TheFooter"
import { useState } from "react";
import TheSideBar from "../common/TheSideBar";
import TheHeader from "../common/TheHeader";

const page = () => {
    const [handle, setHandler] = useState<any>(true)
    const chnaged = (test: boolean) => {
        setHandler(test)
    }
    return (
        <div className="layout-wrapper d-flex flex-nowrap">
            {/****************** SideBar  *******************/}
            <aside className={handle ? "sidebar" : "sidebar mobile-screen"}>
                <TheSideBar handled={handle} />
            </aside>


            {/****************** Main  *******************/}

            <main className={handle ? "dashboad-pages-wrapper" : "dashboad-pages-wrapper-mobile"}>

                {/****************** Header  *******************/}
                <header className="border-bottom">
                    <TheHeader changeDiv={chnaged} />
                </header>

                {/****************** Pages  *******************/}
                <div className="pager-warapper">
                    {/* Pages */}
                    {/* <Outlet /> */}
                </div>

                {/****************** Footer  *******************/}
                {/* <footer>
                    <TheFooter />
                </footer> */}
            </main>
        </div>
    )
}

export default page
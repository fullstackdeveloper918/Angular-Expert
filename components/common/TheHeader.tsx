"use client";
import { useState } from "react";
import Link from "next/link";
const TheHeader = (props: any) => {
  const [hideShow, setHideShow] = useState(true);

  const toggleHandler = () => {
    setHideShow(!hideShow);
    props.changeDiv(!hideShow);
  };

  const logoutUser = async () => {};
  return (
    <div className="container-fluid">
      <div className="row">
        <nav
          className="navbar d-flex justify-content-between align-items-center py-3 px-4"
          role="navigation"
          style={{ marginBottom: "0" }}
        >
          {/* left side  */}
          <div className="navbar-header">
            <button
              className="btn btn-primary shadow-none rounded-1"
              onClick={toggleHandler}
            >
              <i className="fa fa-bars"></i>
            </button>
            {/* serach  */}
          </div>

          {/* right side  */}
          <ul className="nav gap-3 main-nav align-items-center">
            <li>
              <div className="desktop-screen">
                <div className="dropdown">
                  <button
                    className="btn shadow-none border-0 dropdown-toggle p-0 fw-bold mt-1"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul className="dropdown-menu py-0 overflow-hidden">
                    <li className="px-2 pt-2">
                      <Link className="dropdown-item" href="/profile">
                        Profile
                      </Link>
                    </li>

                    <li className="px-2 pt-2">
                      <Link className="dropdown-item" href="/staffs/1">
                        Staff Management
                      </Link>
                    </li>
                    <li className="px-2 pt-2">
                      <Link className="dropdown-item" href="/change-password">
                        Change Password
                      </Link>
                    </li>
                    <li className="divider"></li>
                    <li className="px-2 py-2">
                      <button className="dropdown-item" onClick={logoutUser}>
                        {/* Logout */}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <button
                type="button"
                className="btn btn-primary py-2 px-4 shadow-none logout-btn border-0 fw-fw-semibold"
                onClick={logoutUser}
              >
                <i className="fa fa-sign-out"></i> Log out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TheHeader;

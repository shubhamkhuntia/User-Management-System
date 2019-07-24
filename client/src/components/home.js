import React, { useState, useEffect } from 'react';
import { setUserList } from '../redux/action-creators/users';
import { connect } from 'react-redux';
import { initUser, initEdit, deleteUser } from '../redux/action-creators/users';

const Home = ({
  users,
  setUserList,
  history,
  initUser,
  initEdit,
  deleteUser,
  deleteIds,
  isLoading
}) => {
  useEffect(() => {
    initUser();
    initEdit();
    setUserList();
    // setPagination(parseInt((activeUsers - 1) / maxRowsPerPage) + 1, activePage);
    // console.log(setPagination(2, 1));
  }, []);

  const maxRowsPerPage = 10; // set max rows per page
  let activeUsers = 0; // init index of users
  // @@ is this DANGEROUS ?
  // let pageLen = parseInt((activeUsers - 1) / maxRowsPerPage) + 1;
  // const neighborLen = 1;
  // const actLen = 2 * neighborLen + 1;

  const [query, setQuery] = useState('');
  const [goToPage, setGoToPage] = useState('');

  const [actAttr, setActAttr] = useState(null);
  const [sortOn, setSortOn] = useState(false); // click to sort, db click to unsort
  const [queryCur, setQueryCur] = useState(null); // store the query for search

  const [activePage, setActivePage] = useState(1);
  // if need remember page back, try redux

  const handleChange = e => {
    if (e.target.id === 'search') {
      setQuery(e.target.value);
    } else if (e.target.id === 'goto') {
      setGoToPage(e.target.value);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    setQueryCur(query);
  };

  const handleCreate = e => {
    history.push('/createuser');
  };

  const handleEdit = id => {
    history.push(`/edituser/${id}`);
  };

  const handleDelete = id => {
    deleteUser(id);
    if (activeUsers === (activePage - 1) * maxRowsPerPage + 1) {
      // if it is this page's last user, after delete, back to prev page
      setActivePage(activePage - 1);
    }
    // setDeleteId(id);
  };

  const handleSort = e => {
    setSortOn(!sortOn);
    setActAttr(e.target.id);
  };

  const sortUserByAttr = (users, attribute) => {
    // Don't change the USERS array!
    switch (attribute) {
      case 'firstname':
        return [...users].sort((a, b) =>
          a.firstname > b.firstname
            ? 1
            : a.firstname === b.firstname
            ? a.lastname > b.lastname
              ? 1
              : a.lastname === b.lastname
              ? a.age > b.age
                ? 1
                : a.age === b.age
                ? a.sex > b.sex
                  ? 1
                  : -1
                : -1
              : -1
            : -1
        );

      case 'lastname':
        return [...users].sort((a, b) =>
          a.lastname > b.lastname
            ? 1
            : a.lastname === b.lastname
            ? a.firstname > b.firstname
              ? 1
              : a.firstname === b.firstname
              ? a.age > b.age
                ? 1
                : a.age === b.age
                ? a.sex > b.sex
                  ? 1
                  : -1
                : -1
              : -1
            : -1
        );

      case 'sex':
        return [...users].sort((a, b) =>
          a.sex > b.sex
            ? 1
            : a.sex === b.sex
            ? a.firstname > b.firstname
              ? 1
              : a.firstname === b.firstname
              ? a.lastname > b.lastname
                ? 1
                : a.lastname === b.lastname
                ? a.age > b.age
                  ? 1
                  : -1
                : -1
              : -1
            : -1
        );

      case 'age':
        // console.log([...users][0].age);
        return [...users].sort((a, b) =>
          a.age > b.age
            ? 1
            : a.age === b.age
            ? a.firstname > b.firstname
              ? 1
              : a.firstname === b.firstname
              ? a.lastname > b.lastname
                ? 1
                : a.lastname === b.lastname
                ? a.sex > b.sex
                  ? 1
                  : -1
                : -1
              : -1
            : -1
        );

      default:
        return [...users];
    }
  };

  const handlePrevPage = e => {
    setActivePage(activePage - 1);
  };

  const handleNextPage = e => {
    setActivePage(activePage + 1);
  };

  const handlePageChange = e => {
    setActivePage(e.target.innerText); // for button(btn dont have value)
  };

  const handlePageGoTo = e => {
    // console.log(e.target.tagName); // FORM
    e.preventDefault();
    if (!isNaN(goToPage)) setActivePage(goToPage); // prevent invalid input
  };

  const setPagination = (pageLen, curPage) => {
    // return Array for map: [1,2,'...',9 ]
    // Logic here
    const neighborLen = 1;
    const actLen = 2 * neighborLen + 1; // in act page, then length of linked part
    // [...Array(100).keys()] OR [...Array.from({ length: 100 }).keys()]
    if (pageLen < actLen * 2) {
      // console.log('here', pageLen, actLen, activeUsers);
      return [...Array.from({ length: pageLen }, (v, k) => k + 1)];
      // pageNum + 1, We will get: [1,2,3,4,5]
    } else if (curPage < actLen + 1) {
      // pageLen >= actLen * 2
      // [1,2,3,'...',6]
      return [
        ...Array.from({ length: actLen }, (v, k) => k + 1),
        '...',
        pageLen
      ];
    } else if (curPage > pageLen - actLen) {
      // [1, ... , 4, 5, 6]
      return [
        1,
        '...',
        ...Array.from({ length: actLen }, (v, k) => k + pageLen - actLen + 1)
      ];
    } else {
      // [1, ... , 3,4,5, ..., 7]
      return [
        1,
        '...',
        ...Array.from({ length: actLen }, (v, k) => k + curPage - neighborLen),
        '...',
        pageLen
      ];
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={e => handleSearch(e)}>
          Search:{' '}
          <input id='search' value={query} onChange={e => handleChange(e)} />
          {/* <input type='submit' value='Search' /> */}
        </form>
      </div>
      <div>
        <div>
          <table>
            <thead>
              <th>Edit</th>
              <th>Delete</th>
              <th id='firstname' onClick={e => handleSort(e)}>
                First Name
              </th>
              <th id='lastname' onClick={e => handleSort(e)}>
                Last Name
              </th>
              <th id='sex' onClick={e => handleSort(e)}>
                Sex
              </th>
              <th id='age' onClick={e => handleSort(e)}>
                Age
              </th>
            </thead>
            {(queryCur
              ? (sortOn ? sortUserByAttr(users, actAttr) : users).filter(
                  user =>
                    user.firstname
                      .toLowerCase()
                      .indexOf(queryCur.toString().toLowerCase()) !== -1 ||
                    user.lastname
                      .toLowerCase()
                      .indexOf(queryCur.toString().toLowerCase()) !== -1 ||
                    user.sex
                      .toLowerCase()
                      .indexOf(queryCur.toString().toLowerCase()) !== -1 ||
                    user.age.toString().indexOf(queryCur.toString()) !== -1
                )
              : sortOn
              ? sortUserByAttr(users, actAttr)
              : users
            )
              .map(user => {
                if (deleteIds.indexOf(user._id) === -1) {
                  return {
                    ...user,
                    index: activeUsers++
                  };
                } else {
                  return null; // id in deleteId list
                }
              })
              .filter(user => user) // user exists
              .filter(
                user =>
                  (activePage - 1) * maxRowsPerPage <= user.index &&
                  activePage * maxRowsPerPage > user.index
              )
              .map(user => {
                return (
                  !isLoading &&
                  deleteIds.indexOf(user._id) === -1 && (
                    <tr className='user' key={user._id}>
                      <td>
                        <button onClick={e => handleEdit(user._id)}>
                          Edit
                        </button>
                      </td>
                      <td>
                        <button onClick={e => handleDelete(user._id)}>
                          Delete
                        </button>
                      </td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.sex}</td>
                      <td>{user.age}</td>
                    </tr>
                  )
                );
              })}
          </table>
        </div>
        <div style={{ display: 'flex' }}>
          <button onClick={e => handlePrevPage()} disabled={activePage < 2}>
            Prev Page
          </button>
          <ul style={{ display: 'flex', listStyle: 'none' }}>
            {setPagination(
              parseInt((activeUsers - 1) / maxRowsPerPage) + 1,
              activePage
            ).map(page => {
              if (page === '...') {
                return (
                  <li>
                    <div>...</div>
                  </li>
                );
              } else {
                return (
                  <li>
                    <button onClick={e => handlePageChange(e)}>{page}</button>
                  </li>
                );
              }
            })}
            {/* {activeUsers} and {parseInt((activeUsers - 1) / maxRowsPerPage) + 1} */}
            {/* <li>
              <button onClick={e => handlePageChange(e)}>1</button>
            </li>
            <li>
              <button onClick={e => handlePageChange(e)}>2</button>
            </li>
            ...
            <li>
              <button onClick={e => handlePageChange(e)}>
                {parseInt((activeUsers - 1) / maxRowsPerPage) + 1}
              </button>
            </li> */}
          </ul>
          <button
            onClick={e => handleNextPage()}
            disabled={activePage > parseInt((activeUsers - 1) / maxRowsPerPage)}
          >
            Next Page
          </button>
        </div>
        <div>
          <form onSubmit={e => handlePageGoTo(e)}>
            Go to page:{' '}
            <input id='goto' value={goToPage} onChange={e => handleChange(e)} />
          </form>
        </div>
      </div>
      <div>
        <button onClick={e => handleCreate()}>Create New User</button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    users: state.users.users,
    deleteIds: state.deleteUser.deleteIds,
    isLoading: state.users.isLoading
  };
};

const mapStateToDispatch = dispatch => {
  return {
    setUserList: () => dispatch(setUserList()),
    initUser: () => dispatch(initUser()),
    initEdit: () => dispatch(initEdit()),
    deleteUser: id => dispatch(deleteUser(id))
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(Home);

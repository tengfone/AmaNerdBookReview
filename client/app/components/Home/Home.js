import React, { Component } from 'react';
import { getFromStorage } from '../../utils/storage';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import "../../index.css";
import "mdbreact/dist/css/mdb.css";
import { MDBMask, MDBView, MDBCardBody, MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from "mdbreact";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { Link, link } from 'react-router-dom';
import AniLoading from '../../utils/aniloading';
import 'font-awesome/css/font-awesome.min.css';
import Video from "../../../public/assets/img/readingbook.mp4";
import "./background.css"
import { v4 as uuidv4 } from 'uuid';
import Checkbox from './Checkbox'
import { faShekelSign } from '@fortawesome/free-solid-svg-icons';


export default class Home extends Component {

  state = {
    modal7: false,
    modal8: false,
    modal9: false,
  }

  toggle = nr => () => {
    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber],
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: '',
      firstName: '',
      lastName: '',
      offset: 0,
      book_data: [],
      perPage: 28,
      currentPage: 0,
      dbload: true,
      title: '',
      summary: '',
      description: '',
      price: 0,
      imUrl: 'https://static5.depositphotos.com/1016154/451/i/450/depositphotos_4511462-stock-photo-blank-empty-3d-book-cover.jpg',
      author: '',
      // related: {},
      categories: []
    };

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeimUrl = this.onChangeimUrl.bind(this);
    this.onChangeAuthor = this.onChangeAuthor.bind(this);
    //  this.onChangeSummary = this.onChangeSummary.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onChangeCFW = this.onChangeCFW.bind(this);
    this.onChangeLF = this.onChangeLF.bind(this);
    this.onChangeMST = this.onChangeMST.bind(this);
    this.onChangeDT = this.onChangeDT.bind(this);
    this.onChangeSF = this.onChangeSF.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('AmaNerdBook');
    if (obj && obj.token) {
      const { token } = obj
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json()).then(json => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false,
            })
            // Set Name
            this.setState({
              firstName: obj.firstName,
              lastName: obj.lastName
            })
            this.receivedData(token)
          } else {
            this.setState({
              isLoading: false,
            })
          }
        })
    } else {
      this.setState({
        isLoading: false,
      })
    }
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value
    })
  }

  onChangeimUrl(e) {
    this.setState({
      imUrl: e.target.value
    })
  }

  onChangeAuthor(e) {
    this.setState({
      author: e.target.value
    })
  }

  onChangeCFW(e) {
    let tempcat = this.state.categories;
    console.log(tempcat);
    if (!tempcat.includes("Cookbooks, Food & Wine")) {
      tempcat.push("Cookbooks, Food & Wine")
      this.setState({
        categories: tempcat
      })
    } else {
      let index = tempcat.indexOf("Cookbooks, Food & Wine");
      if (index > -1) {
        tempcat.splice(index, 1);
        this.setState({
          categories: tempcat
        })
      }
    }
  }

  onChangeLF(e) {
    let tempcat = this.state.categories;
    console.log(tempcat);
    if (!tempcat.includes("Literature & Fiction")) {
      tempcat.push("Literature & Fiction")
      this.setState({
        categories: tempcat
      })
    } else {
      let index = tempcat.indexOf("Literature & Fiction");
      if (index > -1) {
        tempcat.splice(index, 1);
        this.setState({
          categories: tempcat
        })
      }
    }
  }

  onChangeMST(e) {
    let tempcat = this.state.categories;
    console.log(tempcat);
    if (!tempcat.includes("Mystery, Thriller & Suspense")) {
      tempcat.push("Mystery, Thriller & Suspense")
      this.setState({
        categories: tempcat
      })
    } else {
      let index = tempcat.indexOf("Mystery, Thriller & Suspense");
      if (index > -1) {
        tempcat.splice(index, 1);
        this.setState({
          categories: tempcat
        })
      }
    }
  }

  onChangeDT(e) {
    let tempcat = this.state.categories;
    console.log(tempcat);
    if (!tempcat.includes("Dictionaries & Thesauruses")) {
      tempcat.push("Dictionaries & Thesauruses")
      this.setState({
        categories: tempcat
      })
    } else {
      let index = tempcat.indexOf("Dictionaries & Thesauruses");
      if (index > -1) {
        tempcat.splice(index, 1);
        this.setState({
          categories: tempcat
        })
      }
    }
  }

  onChangeSF(e) {
    let tempcat = this.state.categories;
    console.log(tempcat);
    if (!tempcat.includes("Science Fiction")) {
      tempcat.push("Science Fiction")
      this.setState({
        categories: tempcat
      })
    } else {
      let index = tempcat.indexOf("Science Fiction");
      if (index > -1) {
        tempcat.splice(index, 1);
        this.setState({
          categories: tempcat
        })
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const asin = uuidv4()

    const book = {
      asin: asin,
      title: this.state.title,
      description: this.state.description,
      categories: this.state.categories,
      price: this.state.price,
      imUrl: this.state.imUrl,
      author: this.state.author,
      //  related: this.state.related,
      categories: this.state.categories
    }

    let log = {
      type: `GET /api/book/addbook`,
      response: ""
    }

    axios.post('/api/book/addbook', book)
      .then(res => {
        console.log(res.status)
        log.response = res.status
        window.location.href = "./"
      })
      .catch((error) => {
        log.response = error.response.status
        console.log(error)
      }).then((_) => {
        axios.post(`/api/book/addLog/${this.state.token}`, log)
          .then((_) => { })
          .catch(err => console.log(err))
      })
  }

  onFilter(e) {
    this.setState({
      dbload: true
    })
    e.preventDefault()
    console.log(this.state.categories)
    let filter1 = {
      "filter": this.state.categories
    }
    axios
      .post('/api/book/applyfilter/', filter1)
      .then(res => {
        const data = res.data;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          book_data: slice,
          dbload: false
        })
      }).then(this.setState({
        modal7: false,
        categories: [],
      }));

  }


  receivedData(token) {
    let log = {
      type: `GET api/book/getallbooks`,
      response: 0
    }
    if (this.props.match.params.query == undefined) {
      this.props.match.params.query = "all"
    }
    axios
      .get(`/api/book/getallbooks/?query=` + this.props.match.params.query)
      .then(res => {
        console.log(res.status)
        log.response = res.status
        const data = res.data;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          book_data: slice,
          dbload: false,
        })
      }).catch(err => {
        log.response = err.response.status
      }).then((_) => {
        axios.post(`/api/book/addLog/${token}`, log)
          .then((_) => { })
          .catch(err => console.log(err))
      });
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset,
      dbload: true,
    }, () => {
      this.receivedData(this.state.token)
    });

  };

  render() {
    const {
      isLoading,
      token,
      firstName,
      lastName,
      dbload,
    } = this.state;

    if (isLoading) {
      return (<div><AniLoading /></div>)
    }

    // style={{overflowY : 'hidden'}}

    // If not logged in
    if (!token) {
      return (
        <body>
          <header className="v-header vcontainer">
            <div className="fullscreen-video-wrap">
              <video src={Video} autoPlay={true} muted loop={true} />
            </div>
            <div className="header-overlay"></div>
            <div className="header-content text-md-center">
              <h1 className="font-weight-bold h1-responsive">Have You Read A Book Today?</h1>
              <p className="yellow-text">With AmaNerd Book Review, You will always find the book that you will want to read!</p>
              <Link to="/login">
                <MDBBtn rounded color="info" type="submit">Log In</MDBBtn>
              </Link>
            </div>
          </header>
        </body>
      );
    }

    // const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    let book = this.state.book_data.map((book, index) => {
      return (
        <MDBCol md="3" key={index}>
          <div className="hover">
            <MDBView hover>
              <img className="card-img-top" src={book.imUrl} alt="Book Images" />
              <MDBMask className="flex-column flex-center" overlay="cyan-strong">
                <h2 className="text-white">{book.title == null ? "Title" : book.title}</h2>
                {
                  book.description == null ? <p></p> : <p>{(book.description).slice(0, 20)}...</p>
                }
                <Link to={`/book/${book.asin}`}>
                  <MDBBtn rounded color="info" type="submit">View Review</MDBBtn>
                </Link>
              </MDBMask>
            </MDBView>
          </div>
        </MDBCol>
      )
    })

    return (
      <div>
        <div className="d-flex flex-row-reverse">
          <div className="d-flex justify-content-end mr-5 mb-5">
            <MDBBtn color="primary" onClick={this.toggle(8)}>Add Book</MDBBtn>
            <MDBBtn color="primary" onClick={this.toggle(7)}>Filter</MDBBtn>
          </div>
        </div>
        <MDBModal isOpen={this.state.modal7} toggle={this.toggle(7)} fullHeight position="right">
          <MDBModalHeader toggle={this.toggle(7)}>Choose a category</MDBModalHeader>
          <MDBModalBody>
            {
              <div>
                <input type="checkbox" className="customControlInput" id="checkbox1" onChange={this.onChangeCFW} />
                <label className="customControlLabel" htmlFor="defaultUnchecked">&emsp;Cookbooks, Food & Wine</label>
                <br></br>
                <input type="checkbox" className="customControlInput" id="checkbox2" onChange={this.onChangeLF} />
                <label className="customControlLabel" htmlFor="defaultUnchecked">&emsp;Literature & Fiction</label>
                <br></br>
                <input type="checkbox" className="customControlInput" id="checkbox3" onChange={this.onChangeMST} />
                <label className="customControlLabel" htmlFor="defaultUnchecked">&emsp;Mystery, Thriller & Suspense</label>
                <br></br>
                <input type="checkbox" className="customControlInput" id="checkbox4" onChange={this.onChangeDT} />
                <label className="customControlLabel" htmlFor="defaultUnchecked">&emsp;Dictionaries & Thesauruses</label>
                <br></br>
                <input type="checkbox" className="customControlInput" id="checkbox5" onChange={this.onChangeSF} />
                <label className="customControlLabel" htmlFor="defaultUnchecked">&emsp;Science Fiction</label>
                <br></br>
                <MDBBtn style={{ justifyContent: "center", marginTop: '1vh', float: "right" }} color="warning" onClick={this.onFilter} outline type="submit">APPLY FILTER</MDBBtn>
              </div>
            }
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle(7)}>Close</MDBBtn>
          </MDBModalFooter>
        </MDBModal>
        <MDBModal isOpen={this.state.modal8} toggle={this.toggle(8)} fullHeight position="right">
          <MDBModalHeader toggle={this.toggle(8)}>Add A Book</MDBModalHeader>
          <MDBModalBody>
            {
              <div>
                <form>
                  <label htmlFor="materialContactFormName" className="grey-text">Title</label>
                  <input type="text"
                    className="form-control"
                    required
                    value={this.state.title}
                    onChange={this.onChangeTitle}
                  />
                  <br />
                  <label htmlFor="materialContactFormName" className="grey-text">Author</label>
                  <input type="text"
                    className="form-control"
                    required
                    value={this.state.author}
                    onChange={this.onChangeAuthor}
                  />
                  <br />
                  <label htmlFor="materialContactFormName" className="grey-text">Image URL</label>
                  <input type="text"
                    className="form-control"
                    required
                    value={this.state.imUrl}
                    onChange={this.onChangeimUrl}
                  />
                  <br />
                  <label htmlFor="materialContactFormName" className="grey-text">Description</label>
                  <textarea type="text"
                    rows="3"
                    className="form-control"
                    required
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                  />
                  <br />
                  <label htmlFor="materialContactFormName" className="grey-text">Price</label>
                  <input type="number"
                    className="form-control"
                    required
                    value={this.state.price}
                    onChange={this.onChangePrice}
                  />
                  <br />
                  <div className="text-center mt-4">
                    <MDBBtn color="warning" onClick={this.onSubmit} outline type="submit">Add Book</MDBBtn>
                  </div>
                </form>
              </div>
            }
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle(8)}>Close</MDBBtn>
          </MDBModalFooter>
        </MDBModal>


        <MDBModal isOpen={this.state.modal9} toggle={this.toggle(9)} fullHeight position="right">
          <MDBModalHeader toggle={this.toggle(9)}>Add A Book</MDBModalHeader>
          <MDBModalBody>
            <div>
              <MDBBtn color="warning" onClick={this.onFilter} outline type="submit">Filter</MDBBtn>
            </div>
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={this.toggle(9)}>Close</MDBBtn>
          </MDBModalFooter>
        </MDBModal>

        {
          dbload == true ? <AniLoading /> : <div className="container-fluid">
            <div className="row">
              {book}
            </div>
          </div>
        }
        <div>
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"} />
        </div>
      </div>
    )
  }
}
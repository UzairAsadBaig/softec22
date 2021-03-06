import React, { useState, useContext, useEffect } from 'react'
import './../css/Profile.css'
import doctor from '../Data/doctor'
import ClinicsTable from './ClicincsTable'
import Input from './Input'
import moment from 'moment'
import Review from './Review'
import { DatePicker } from 'antd'
import Navbar from './Navbar'
import Footer from './Footer'
import { useParams } from 'react-router-dom'
import Api from '../Api'
import UsersContext from '../context/users/UsersContext'
import AppContext from '../context/appState/AppContext'

const { RangePicker }=DatePicker;



const Profile=() => {
  const [ doc, setDoc ]=useState( {} );
  const[check,setCheck]=useState(false);
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [slotFree,setSlotfree]=useState('false');
    const [booking,setBooking]=useState({
      patient:'',
      doctor:'',
      medicalHistory:'',

    });
    const {onChangeGeneric,showAlert}=useContext(AppContext);
    const {user}=useContext(UsersContext);
    const onChange= onChangeGeneric(booking,setBooking);


    const checkClinicSlot=(values)=>{
     let clinicSlots=[]; 
     doc.clinics.map((e)=>{
       clinicSlots.push(e.openingHour);
      });

      var selectedFrom = moment(new Date(values[0]._d)).format(
        "MMM DD yyyy HH:mm"
      );
      var selectedTo = moment(new Date(values[1]._d)).format(
        "MMM DD yyyy HH:mm"
      );

      for (var booking of clinicSlots) {
        if (
          moment(values[0]._d).isBetween(
            booking.from,
            booking.to,
            undefined,
            "[]"
          ) ||
          moment(values[1]._d).isBetween(
            booking.from,
            booking.to,
            undefined,
            "[]"
          ) ||
          moment(booking.from).isBetween(
            selectedFrom,
            selectedTo,
            undefined,
            "[]"
          ) ||
          moment(booking.to).isBetween(
            selectedFrom,
            selectedTo,
            undefined,
            "[]"
          )
        ){
          return true;
        }
      }

     return false
    }



    const handleBookingSubmission=async()=>{
      // console.log({...booking,bookedTimeSlots:{
      //   from,
      //   to
      // }})
      const endPoint='appointments'
      const res=await Api.post( endPoint, {...booking,bookedTimeSlots:{
        from,
        to
      },
      patient:user._id,
      doctor: doc._id
    },{headers:{Authorization:`Bearer ${token}`}} );

    if(res.data.status=='success')
    showAlert('Appointment has been booked','success')
    else
    showAlert("Appointment couldn't be booked",'danger')
      
    }

    const setFilter = (values)=> {
    if (values) {
      if (values.length > 1) {
        // var selectedFrom = moment(values[0], "MMM DD yyyy HH:mm");
        // var selectedTo = moment(values[1], "MMM DD yyyy HH:mm");
        setFrom(moment(values[0]).format("MMM DD yyyy HH"));
        setTo(moment(values[1]).format("MMM DD yyyy HH"));
        var selectedFrom = moment(new Date(values[0]._d)).format(
          "MMM DD yyyy HH:mm"
        );
        var selectedTo = moment(new Date(values[1]._d)).format(
          "MMM DD yyyy HH:mm"
        );
          const doc=doctor[0];
          console.log(doc.bookedS.length);
          if(doc.appointmentSchedule.length==0){
            setCheck(true);
          }
          else{
            for (var booking of doc.appointmentSchedule) {
              if ((
                (moment(values[0]._d).isBetween(
                  booking.from,
                  booking.to,
                  undefined,
                  "[]"
                ) ||
                moment(values[1]._d).isBetween(
                  booking.from,
                  booking.to,
                  undefined,
                  "[]"
                ) ||
                moment(booking.from).isBetween(
                  selectedFrom,
                  selectedTo,
                  undefined,
                  "[]"
                ) ||
                moment(booking.to).isBetween(
                  selectedFrom,
                  selectedTo,
                  undefined,
                  "[]"
                ) 
                )
                ) 
              ) {
                setCheck(false);
              }else {
             
                console.log(booking);
                 setCheck(true); 
              }
            }
          }
     }
    }
  }



  const { id }=useParams();

  const { Cookies }=useContext( UsersContext );
  const token=Cookies.get( 'jwt' );

  const getDoctorData=async ( id ) => {
    const res=await Api.get( `/users/${id}`, { headers: { Authorization: `Bearer ${token}` } } )
    setDoc( res.data.data );


  }

  useEffect( () => {
    getDoctorData( id );
  }, [] )


  return (
    <>
 {/* reviews */}
      <Navbar />
      <div className="container" style={{ marginTop: "6rem" }}>

        <div className="row">

          <div className="col-md-5">
            <div className="card profile_card" >
              <img src={require( './../img/doctor.jpg' )} className="card-img-top card_img " alt="..." />
              <div className="card-body py-4">


                <div className="row" >
                  <div className="col-6  fw-bold">Name:</div>
                  <div className="col-6 name_val">{doc.name}</div>
                  <hr className='line mx-auto' />


                  <div className="col-6  fw-bold">Gender:</div>
                  <div className="col-6 gender_val">{doc.gender}</div>
                  <hr className='line mx-auto' />

                  <div className="col-6  fw-bold">Contact no:</div>
                  <div className="col-6 phone_val">{doc.phone}</div>
                  <hr className='line mx-auto' />


                  <div className="col-6  fw-bold">Specialized in:</div>
                  <div className="col-6 specialize_val">{doc.speciality}</div>
                  <hr className='line mx-auto' />

                  <div className="col-6  fw-bold">Ratings:</div>
                  <div className="col-6 rating_val">{`${doc.ratingsAverage? doc.ratingsAverage:'1'}/5`}</div>

                </div>


              </div>
            </div>

          </div>

          <div className="col-md-7 ps-5">

            <div className="card profile_card" >

              <div className="card-body" >
                <div style={{ maxHeight: '37rem', overflowY: 'scroll' }}>
                  <Review reviews={doc.reviews} doctor={id} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      
{/* reviews */}



                <div className="container text-center" style={{"padding":"5rem"}}>
                  <h2 className='text-center profile_head'>My Clinics</h2>
        <ClinicsTable clinics={doc.clinics} />

                    <RangePicker className='RangePicker'  showTime={{format:"HH:mm a"}} format="MMM DD yyyy HH:mm" onChange={setFilter} style={{ height: "3.5rem", width: "37rem" }}/><br/>

           {check && <button type="button" className="btn btn-primary mt-3 mb-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Book Now
            </button>}
            </div>
            <div className="modal fade" id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true"  >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Enter your medical history</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body">
                  <form >
        <div className="form-group">
        <textarea className="form-control" name='medicalHistory' id="exampleFormControlTextarea1" rows={3} onChange={onChange} />
        </div>

                  </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" onClick={handleBookingSubmission} className="btn btn-primary">Submit</button>
                  </div>
                </div>
              </div>
            </div>
      <Footer />
    </>

  )
}
export default Profile
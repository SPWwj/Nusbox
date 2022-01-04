import { Inject, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth, ScheduleComponent, ActionEventArgs, ResourcesDirective, ResourceDirective } from '@syncfusion/ej2-react-schedule';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import * as signalR from "@microsoft/signalr";
import { ModuleToSchedule } from '../../../utilis/ModuleToSchedule';
import './Scheduler.css';
import { Collapse, Drawer, Input } from 'antd';
import { ChatMessage } from '../../../model/ChatMessage';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Info from '../../shared/Info';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Guid } from 'guid-typescript';
import { UserData } from '../../../model/UserData';
import { Button, Dropdown, DropdownButton, FormControl, InputGroup, Modal } from 'react-bootstrap';
import { IScheduleData } from '../../../interfaces/IScheduleData';
import { EventType, Event } from '../../../model/EventProps';
import { AppointmentData, aptToIApt, iAptToApt } from '../../../model/AppointmentData';
import { IAppointmentData } from '../../../interfaces/IAppointmentData';
import { TimetableLink } from '../../../model/TimetableLink';
import { Colors } from '../../../utilis/Colors';

export type TimeTableUrl = {
  url: string;
}


function Scheduler() {
  let { room } = useParams();
  const { Search } = Input;
  // const myUrl = 'https://nusmods.com/timetable/sem-2/share?CS1231S=TUT:05,LEC:1&CS2030S=REC:06,LAB:16B,LEC:1&CS2100=LAB:07,TUT:17,LEC:1&ES1103=SEC:A07&MA1521=LEC:1,TUT:6';
  const [showSidebar, setShowSidebar] = useState(true)
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [userData, setUserData] = useState<UserData>(new UserData({ roomID: room?.toString(), id: Guid.create().toString()}));
  const userRef = useRef<UserData>()
  userRef.current = userData;
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const allUsersRef = useRef<UserData[]>([])
  allUsersRef.current = allUsers;
  const updateCount = useRef(0);
  type InfoHandle = React.ElementRef<typeof Info>;
  const info = useRef<InfoHandle>(null);

  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const appointmentsRef = useRef<AppointmentData[]>([]);
  appointmentsRef.current = appointments;
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [timetables, setTimetables] = useState<TimetableLink[]>([]);
  const timetablesRef = useRef<TimetableLink[]>([]);
  timetablesRef.current = timetables;
  const chatsRef = useRef<ChatMessage[]>([]);
  chatsRef.current = chats;
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7104/chathub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    
    if (connection && room !== undefined) {
      setUserData(new UserData({ roomID: room?.toString(), id: Guid.create().toString()}));
      connection.start()
        .then(result => {
          connection.on('ReceiveChat', (chatMessages: ChatMessage[]) => {
            setChats(chats => [...chats, ...chatMessages]);
            updateCount.current += 1;
          });
          connection.on('ReceiveMessage', async (scheduleData: IScheduleData) => {

            switch (scheduleData.event as Event) {
              case Event.appointment: {
                switch (scheduleData.eventType) {
                  case EventType.add: {
                    var data = iAptToApt(scheduleData.appointments);
                    setAppointments(appointments => [...appointments, ...data]);
                    break;
                  }
                  case EventType.delete: {
                    const data = scheduleData.appointments;
                    setAppointments(appointments => [...appointments.filter(a => !data.some(s => s.id === a.Id))]);
                    break;
                  }
                  case EventType.edit: {
                    const data = iAptToApt(scheduleData.appointments as IAppointmentData[]);
                    setAppointments(appointments => [...appointments.filter(a => !scheduleData.appointments.some(s => s.id === a.Id)), ...data]);
                    break;
                  }
                }
                updateCount.current += 1;
                break;

              }
              case Event.timetable: {
                switch (scheduleData.eventType) {
                  case EventType.add: {
                    setTimetables(timetables => [...timetables,...scheduleData.timetableLinks]);
                    const data = await Promise.all(scheduleData.timetableLinks.map(async (x) => {
                      const modToSchedule = new ModuleToSchedule();
                      return await modToSchedule.DecodeUrl(x);
                    }));
                    let result: AppointmentData[] = [];
                    result = result.concat(...data);
                    setAppointments(appointments => [...appointments,...result]);
                    break;
                  }
                  case EventType.delete: {
                    setTimetables(timetables => [...timetables.filter(t => !scheduleData.timetableLinks.some(s => s.id === t.id))]);
                    setAppointments(appointments => [...appointments.filter(a => !scheduleData.timetableLinks.some(s => s.id === a.TimeTableLinkId))]);
                    break;
                  }
                }
                updateCount.current +=1;
                break;
              }
              case (Event.userEvent):
                switch (scheduleData.eventType) {
                  case (EventType.add):
                    setAllUsers(allUsers => [...allUsers, ...scheduleData.userDatas]);
                    break;
                  case (EventType.edit):
                    setAllUsers(allUsers => [...allUsers.filter(u => !scheduleData.userDatas.some(s => s.id === u.id)), ...scheduleData.userDatas]);
                    console.log(allUsersRef.current);
                    console.log(scheduleData.userDatas);

                    break;
                }
                updateCount.current +=1;
                break;
              case Event.planting: {
                switch (scheduleData.eventType) {
                  case EventType.seedRequest: {
                    scheduleData.updateCount = updateCount.current;
                    scheduleData.eventType = EventType.seedInfo;
                    connection.send("PlantingMessage", scheduleData);
                    break;
                  }
                  case EventType.seedInfo: {
                    if (updateCount.current < scheduleData.updateCount) {
                      updateCount.current += scheduleData.updateCount;
                      scheduleData.eventType = EventType.seedAccept;
                      connection.send("PlantingMessage", scheduleData);
                    }
                    break;
                  }
                  case EventType.seedAccept: {
                    scheduleData.eventType = EventType.seeding;
                    scheduleData.appointments = aptToIApt(appointmentsRef.current);
                    scheduleData.userDatas = allUsersRef.current!;
                    scheduleData.timetableLinks = timetablesRef.current;
                    scheduleData.chatMessages = chatsRef.current;
                    connection.send("PlantingMessage", scheduleData);
                    break;
                  }
                  case EventType.seeding: {
                    setAllUsers(allUsers => [...allUsers, ...scheduleData.userDatas]);
                    setTimetables([...scheduleData.timetableLinks]);
                    setAppointments(iAptToApt(scheduleData.appointments));
                    setChats([...scheduleData.chatMessages]);
                    break;
                  }
                }
                break;
              }
              default :
                break;
            }
            

          });
          connection.send("JoinRoom", room?.toString());
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection,room]);

  const { Panel } = Collapse;

  const toggleSibar = () => (
    <MessageOutlined style={{ fontSize: "2.5vh", color: 'green' }}
      onClick={event => {
        // If you don't want click extra trigger collapse, you can prevent this:
        setShowSidebar(!showSidebar);
        event.stopPropagation();
      }}
    />
  );
  function onSendChat(value: string) {
    if (value !== "") {
      connection?.send("SendChat", [new ChatMessage({ name: userData.name, text: value, senderId: userData.id, id: Guid.create().toString() })], userData.roomID).then(
        // () => 
        // console.log("msg sent")
      );
      chatInput.current?.setValue("");
    } else {
      info.current?.toggleInfo("Chat Cannot be Empty");
    }

  }
  function onImportUrl(value: string) {
    if (value !== "") {

      let scheduleData: IScheduleData = {
        roomID: userData.roomID,
        name: userData.name,
        connectionId: '',
        updateCount: 0,
        appointments: [],
        timetableLinks: [new TimetableLink({ name: userData.name, url: value, owerID: userData.id, id: Guid.create().toString() })],
        chatMessages: [],
        userDatas: [],
        event: Event.timetable,
        eventType: EventType.add
      }
      connection?.send("SendMessage", scheduleData);
      // () => 
      // console.log("msg sent")
      urlInput.current?.setValue("");
    } else {
      // info.current?.toggleInfo("Url Cannot be Empty");
    }

  }
  function onDeleteUrl(value: TimetableLink) {

      let scheduleData: IScheduleData = {
        roomID: userData.roomID,
        name: userData.name,
        connectionId: '',
        updateCount: 0,
        appointments: [],
        timetableLinks: [value],
        chatMessages: [],
        userDatas: [],
        event: Event.timetable,
        eventType: EventType.delete
      }
      connection?.send("SendMessage", scheduleData);
      // () => 
      // console.log("msg sent")


  }
  const chatInput = useRef<Input>(null);
  const nameInput = useRef<Input>(null);
  const urlInput = useRef<Input>(null);

  function setName() {
    userData.name = nameInput.current?.state.value;
    setUserData(userData => ({ ...userData }));
    const scheduleData: IScheduleData = {
      roomID: userData.roomID,
      name: userData.name,
      connectionId: '',
      updateCount: 0,
      appointments: [],
      timetableLinks: [],
      chatMessages: [],
      userDatas: [userRef.current!],
      event: Event.userEvent,
      eventType: EventType.add
    }
    connection?.send("SendMessage", scheduleData);
    // console.log(userData);
  }
  function actionBegain(args: ActionEventArgs) {
    // if (args.requestType === 'toolbarItemRendering') {
    //   // This block will execute before toolbarItem render
    // }
    // if (args.requestType === 'dateNavigate') {
    //   // This block will execute before previous and next navigation
    // }
    // if (args.requestType === 'viewNavigate') {
    //   // This block will execute before view navigation
    // }
    const scheduleData: IScheduleData = {
      roomID: userData.roomID,
      name: userData.name,
      connectionId: '',
      updateCount: 0,
      appointments: [],
      timetableLinks: [],
      chatMessages: [],
      userDatas: [],
      event: Event.appointment,
      eventType: null
    }

    switch (args.requestType) {
      case 'eventCreate':
        args.addedRecords?.forEach(r => {
          r["Id"] = Guid.create().toString();
          r["Subject"] = `${userData.name} ${r["Subject"]} ${r["Id"]}`;
          r["UserDataId"] = userData.id;
        });
        scheduleData.appointments = [...args.addedRecords as IAppointmentData[]];
        scheduleData.eventType = EventType.add;
        args.cancel = true;
        connection?.send("SendMessage", scheduleData);
        break;
      case 'eventChange':
        scheduleData.appointments = [...args.changedRecords as IAppointmentData[]];
        scheduleData.eventType = EventType.edit;
        args.cancel = true;
        connection?.send("SendMessage", scheduleData);

        break;
      case 'eventRemove':
        scheduleData.appointments = [...args.deletedRecords as IAppointmentData[]];
        scheduleData.eventType = EventType.delete;
        args.cancel = true;
        connection?.send("SendMessage", scheduleData);
        break;
    }

  }

  function changeUserColor(i:number, user :UserData) {
    console.log(i);
    user.themeColor = Colors[i];
    setUserData(userData => ({...user}));
    const scheduleData: IScheduleData = {
      roomID: userData.roomID,
      name: userData.name,
      connectionId: '',
      updateCount: 0,
      appointments: [],
      timetableLinks: [],
      chatMessages: [],
      userDatas: [user],
      event: Event.userEvent,
      eventType: EventType.edit
    }
    connection?.send("SendMessage", scheduleData);
    
  }


  if (room === undefined) {
    room = Guid.create().toString();
    return < Navigate to={`/scheduler/${room}`} />;
  }
  return (
    <div className="scheduler">

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered show={userData.name === undefined}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Enter Your Name
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Name</h4>
          <Input ref={nameInput} placeholder="Enter Name Here" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={setName}>Enter</Button>
        </Modal.Footer>
      </Modal>

      <Drawer getContainer={false}
        style={{ top: "auto" }}
        title={userData.name === undefined ? "" :  `Hi ${userData.name}`}
        placement="right"
        onClose={() => setShowSidebar(false)}
        visible={showSidebar}
        mask={false}>
        {
          chats.map(chat => {
            return (
              <div key={chat.id.toString()}>
                <p className={chat.senderId === userData.id ? 'chat-right' : 'chat=left'}>{chat.name} : {chat.text}</p>
              </div>
            );
          })
        }
        {/* <h1>{count}</h1> */}
        <Search
          placeholder="..."
          allowClear
          enterButton="Send"
          size="large"
          onSearch={onSendChat}
          ref={chatInput}
        />
        <Info ref={info} variant={'red'} children={'warning'} />

      </Drawer>
      <Collapse>
        <Panel extra={toggleSibar()} header="Import Your Timetable Here" key="1" showArrow={true}>
          {timetables.map(t =>
            <InputGroup key={t.id} className="mb-3">
              <FormControl readOnly value={ `${t.name} ${t.id} ${t.url}`}
              />
              <Button onClick={()=>onDeleteUrl(t)} variant="outline-secondary" id="button-addon2">
                <DeleteOutlined />
              </Button>
            </InputGroup>
          )}
          <Search
            placeholder="input timetable share url"
            allowClear
            enterButton="Import"
            size="large"
            onSearch={onImportUrl}
            ref={urlInput}
          />
        </Panel>
        <Panel header="All User Here" key="2" showArrow={true}>
          {allUsers.map(u =>
            <InputGroup key={u.id} className="mb-3">
              <FormControl style={{backgroundColor : u.themeColor, color: "white"}} readOnly value={`${u.name} ${u.id} ${u.roomID} ${u.themeColor}`}
              />
              <DropdownButton disabled={!(userData.id === u.id)} 
                // variant="outline-secondary"
                title=""
                id="input-group-dropdown-2"
                align="end"
              >
                {Colors.map((c,i) => <Dropdown.Item key={i} onClick={()=> changeUserColor(i,u)} style={{backgroundColor : c, color:"white"}}>{c}</Dropdown.Item>)}

              </DropdownButton>
            </InputGroup>
            
          )}
        </Panel>
      </Collapse>
      <ScheduleComponent startHour='00:00' endHour='24:00' actionBegin={actionBegain} eventSettings={{
        dataSource: appointments
      }}
      >
        <ResourcesDirective>
          <ResourceDirective field='UserDataId' title='Owner' name='name' allowMultiple={true} dataSource={allUsers} textField='name' idField='id' colorField='themeColor'>
          </ResourceDirective>
        </ResourcesDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineMonth]} />
      </ScheduleComponent>

    </div>

  );
}
export default Scheduler;


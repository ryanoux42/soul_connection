drop database if exists soul_connection;

create database soul_connection;

\c soul_connection;

create table token
(
  id SERIAL,
  token varchar(255) not null,
  primary key (id)
);

create table employee
(
  user_id int not null,
  email varchar(255) not null,
  firstname varchar(255) not null,
  lastname varchar(255) not null,
  gender varchar(255) not null,
  birth_date date not null,
  work varchar(255) not null,
  primary key (user_id)
);

create table customer
(
  customer_id int not null,
  email varchar(255) not null,
  firstname varchar(255) not null,
  lastname varchar(255) not null,
  gender varchar(255) not null,
  birth_date date not null,
  descr text not null,
  astro_sign varchar(255) not null,
  phone_number varchar(255) not null,
  _address varchar(255) not null,
  primary key (customer_id)
);

create table payement
(
  payement_id int not null,
  customer_id int not null,
  _date date not null,
  payment_method varchar(255) not null,
  amount float not null,
  comment varchar(255) not null,
  primary key (payement_id),
  foreign key (customer_id) references customer(customer_id)
);

create table encounter
(
  encounter_id int not null,
  customer_id int not null,
  _date date not null,
  rating int not null,
  comment text not null,
  source varchar(255) not null,
  primary key (encounter_id),
  foreign key (customer_id) references customer(customer_id)
);

create table tip
(
  id int not null,
  title varchar(255) not null,
  tip text not null,
  primary key (id)
);

create table event
(
  event_id int not null,
  _name varchar(255) not null,
  _date date not null,
  duration int not null,
  max_participants int not null,
  location_x float not null,
  location_y float not null,
  _type varchar(255) not null,
  location_name varchar(255) not null,
  employee_id int,
  primary key (event_id),
  foreign key (employee_id) references employee(user_id)
);

create table link_customer_coach
(
  id SERIAL,
  customer_id int not null,
  coach_id int not null,
  primary key (id)
);

create table clothe
(
  id SERIAL,
  clothe_id int not null,
  customer_id int not null,
  _type varchar(255) not null,
  primary key (id),
  foreign key (customer_id) references customer(customer_id)
);


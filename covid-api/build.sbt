ThisBuild /  version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "3.2.1"

lazy val root = (project in file("."))
  .settings(
    name := "ScalaApp",
    idePackagePrefix := Some("com.frizzer.covidapp")
  )

val http4sVersion = "1.0.0-M39"
val circeVersion = "0.14.5"
val scalatestVersion = "3.2.15"

libraryDependencies ++= Seq(
  "org.http4s" %% "http4s-ember-client" % http4sVersion,
  "org.http4s" %% "http4s-ember-server" % http4sVersion,
  "org.http4s" %% "http4s-dsl" % http4sVersion,
  "org.http4s" %% "http4s-circe" % http4sVersion,
  // Optional for auto-derivation of JSON codecs
  "io.circe" %% "circe-generic" % circeVersion,
  // Optional for string interpolation to JSON model
  "io.circe" %% "circe-literal" % circeVersion,
  "org.scalatest" %% "scalatest" % "3.2.15" % Test
)
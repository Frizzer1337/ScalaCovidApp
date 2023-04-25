package com.frizzer.covidapp

import cats.effect.unsafe.implicits.global
import cats.effect.{ExitCode, IO, IOApp}
import cats.implicits.*
import cats.syntax.*
import com.comcast.ip4s.*
import io.circe.generic.auto.*
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, Json}
import org.http4s.circe.*
import org.http4s.circe.CirceEntityCodec.circeEntityEncoder
import org.http4s.client.JavaNetClientBuilder
import org.http4s.dsl.io.*
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.implicits.uri
import org.http4s.server.Router
import org.http4s.server.middleware._
import org.http4s.{EntityDecoder, EntityEncoder, HttpRoutes, Request}
import com.frizzer.covidapp.entity.{Country,CovidData,CovidDataResponse}
import com.frizzer.covidapp.service.singleCountryService
import com.frizzer.covidapp.service.countriesService

import java.time.Instant
import scala.language.postfixOps

object Main extends IOApp {

  val corsSingleCountryService = CORS.policy.withAllowOriginAll(singleCountryService)
  val corsCountriesService = CORS.policy.withAllowOriginAll(countriesService)

  val httpApp = Router("/api" -> (corsSingleCountryService <+> corsCountriesService)).orNotFound

  def run(args: List[String]): IO[ExitCode] =
    EmberServerBuilder
      .default[IO]
      .withHost(ipv4"0.0.0.0")
      .withPort(port"7000")
      .withHttpApp(httpApp)
      .build
      .use(_ => IO.never)
      .as(ExitCode.Success)

}
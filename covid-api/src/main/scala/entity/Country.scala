package com.frizzer.covidapp
package entity

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
import org.http4s.{EntityDecoder, EntityEncoder, HttpRoutes, Request}


case class Country(Country: String,
                   Slug: String,
                   ISO2: String)

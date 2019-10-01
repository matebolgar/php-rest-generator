<?php

namespace RootNamespace\Generated\Auth;

interface TokenVerifier
{
    public function verify(string $token): ?Claims;
}
